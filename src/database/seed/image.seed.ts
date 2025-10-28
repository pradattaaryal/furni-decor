import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { QueryRunner } from 'typeorm';

export const seedImages = async (queryRunner: QueryRunner) => {
  console.log('🖼️ Running Image Seeder');

  // Check if already seeded
  const existing = await queryRunner.manager.find(ImageEntity);
  if (existing.length > 0) {
    console.log('⚠️ Images already seeded, skipping...');
    return;
  }

  const imagesData = Array.from({ length: 50 }, (_, i) => ({
    path: `uploads/images/image${i + 1}.jpg`,
    filename: `image${i + 1}.jpg`,
    mime: 'image/jpeg',
    size: Math.floor(Math.random() * 500000) + 50000, // 50KB - 550KB
    type: 'product_variants',
    // remove product to avoid TypeORM error
    blogs: [], // OneToMany relation can be empty
  }));

  const imageEntities = imagesData.map((img) =>
    queryRunner.manager.create(ImageEntity, img),
  );

  await queryRunner.manager.save(ImageEntity, imageEntities);

  console.log(`✅ ${imageEntities.length} Images seeded successfully!`);
};
