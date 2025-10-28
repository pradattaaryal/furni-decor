export interface IHashValueRedisService {
  hSet(
    key: string,
    fields: Record<string, string | number>,
    ttl?: number | null,
  ): Promise<number>;
  hGet(key: string, field: string): Promise<string | null>;
  hmGet(key: string, fields: string[]): Promise<(string | null)[]>;
  hIncrBy(key: string, field: string, increment: number): Promise<number>;
  hDecrBy(key: string, field: string, increment: number): Promise<number>;
  hDel(key: string, fields: string[]): Promise<number>;
  deleteHash(key: string): Promise<void>;
}
