import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KeyValueRedisService } from 'src/common/key-value/services/key-value.redis.service';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductCacheService {
  private readonly ttlSeconds: number;

  constructor(
    private readonly keyValue: KeyValueRedisService,
    private readonly configService: ConfigService,
  ) {
    // Fallback to 300s if not configured
    this.ttlSeconds = Number(
      this.configService.get('helper.cacheTtlSeconds') ?? 300,
    );
  }

  private byIdKey(productId: number): string {
    return `product:byId:${productId}`;
  }

  private bySlugKey(slug: string): string {
    return `product:bySlug:${slug}`;
  }

  private listKeyBase(): string {
    return 'product:list:';
  }

  private stableStringify(input: any): string {
    const seen = new WeakSet();
    const sorter = (obj: any): any => {
      if (obj === null || typeof obj !== 'object') return obj;
      if (seen.has(obj)) return '[Circular]';
      seen.add(obj);
      if (Array.isArray(obj)) return obj.map((v) => sorter(v));
      const keys = Object.keys(obj).sort();
      const out: Record<string, any> = {};
      for (const k of keys) {
        const val = (obj as any)[k];
        if (typeof val === 'function') {
          out[k] = `[Function:${val.name || 'anonymous'}]`;
        } else if (val && typeof val === 'object' && 'constructor' in val) {
          const ctor = (val as any).constructor?.name;
          // Reduce complex operator instances to plain value-like object
          if (ctor && ctor !== 'Object' && ctor !== 'Array') {
            out[k] = { __type: ctor, ...sorter({ ...val }) };
          } else {
            out[k] = sorter(val);
          }
        } else {
          out[k] = sorter(val);
        }
      }
      return out;
    };
    return JSON.stringify(sorter(input));
  }

  private listKeyFromOptions(options: any): string {
    // Only include query-affecting fields
    const safe = {
      page: (options as any)?.page,
      limit: (options as any)?.limit,
      search: (options as any)?.search,
      searchableColumns: (options as any)?.searchableColumns,
      defaultSearchColumns: (options as any)?.defaultSearchColumns,
      sortableColumns: (options as any)?.sortableColumns,
      defaultSortColumn: (options as any)?.defaultSortColumn,
      defaultSortOrder: (options as any)?.defaultSortOrder,
      options: {
        where: (options as any)?.options?.where,
        select: (options as any)?.options?.select,
        relations: (options as any)?.options?.relations,
      },
    };
    return this.listKeyBase() + this.stableStringify(safe);
  }

  async getById(productId: number): Promise<ProductEntity | null> {
    const raw = await this.keyValue.get(this.byIdKey(productId));
    return raw ? (JSON.parse(raw) as ProductEntity) : null;
  }

  async getBySlug(slug: string): Promise<ProductEntity | null> {
    const raw = await this.keyValue.get(this.bySlugKey(slug));
    return raw ? (JSON.parse(raw) as ProductEntity) : null;
  }

  async setById(productId: number, product: ProductEntity): Promise<void> {
    await this.keyValue.set(this.byIdKey(productId), JSON.stringify(product), {
      expirationSeconds: this.ttlSeconds,
    });
  }

  async setBySlug(slug: string, product: ProductEntity): Promise<void> {
    await this.keyValue.set(this.bySlugKey(slug), JSON.stringify(product), {
      expirationSeconds: this.ttlSeconds,
    });
  }

  async invalidateById(productId: number): Promise<void> {
    await this.keyValue.removeKey(this.byIdKey(productId));
  }

  async invalidateBySlug(slug: string): Promise<void> {
    await this.keyValue.removeKey(this.bySlugKey(slug));
  }

  async invalidateForProduct(product: {
    id?: number;
    slug?: string;
  }): Promise<void> {
    if (product?.id) await this.invalidateById(product.id);
    if (product?.slug) await this.invalidateBySlug(product.slug);
  }

  async getPaginated(options: any): Promise<any | null> {
    const key = this.listKeyFromOptions(options);
    const raw = await this.keyValue.get(key);
    return raw ? JSON.parse(raw) : null;
  }

  async setPaginated(options: any, value: any): Promise<void> {
    const key = this.listKeyFromOptions(options);
    await this.keyValue.set(key, JSON.stringify(value), {
      expirationSeconds: this.ttlSeconds,
    });
  }

  async invalidateAllPaginated(): Promise<void> {
    const keys = await this.keyValue.getAllExistKeys(this.listKeyBase() + '*');
    if (Array.isArray(keys) && keys.length) {
      for (const k of keys) {
        await this.keyValue.removeKey(k);
      }
    }
  }
}
