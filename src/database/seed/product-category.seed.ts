import { CategoryEntity } from 'src/modules/category/entities/category.entity';
import { QueryRunner } from 'typeorm';

export const seedCategories = async (queryRunner: QueryRunner) => {
  console.log('🌱 Running Category Seed');

  const existing = await queryRunner.manager.find(CategoryEntity);
  if (existing.length > 0) {
    console.log('⚠️ Categories already seeded, skipping...');
    return;
  }

  const parentCategories = [
    {
      name: 'Living Room',
      description:
        'Furniture designed for comfort and style in your living space.',
    },
    {
      name: 'Bedroom',
      description: 'Essentials for a cozy and relaxing bedroom.',
    },
    {
      name: 'Office',
      description: 'Office furniture for productivity and ergonomics.',
    },
    {
      name: 'Outdoor',
      description: 'Durable furniture for your patio or garden.',
    },
  ];

  // Save parent categories first
  const savedParents = await queryRunner.manager.save(
    CategoryEntity,
    parentCategories.map((cat) =>
      queryRunner.manager.create(CategoryEntity, cat),
    ),
  );

  const childCategories = [
    {
      name: 'Sofas & Couches',
      parent_id: savedParents.find((p) => p.name === 'Living Room')?.id,
      description: 'Stylish and comfortable sofas for your living room.',
    },
    {
      name: 'Coffee Tables',
      parent_id: savedParents.find((p) => p.name === 'Living Room')?.id,
      description: 'Elegant tables to complement your seating area.',
    },
    {
      name: 'Beds',
      parent_id: savedParents.find((p) => p.name === 'Bedroom')?.id,
      description: 'Comfortable beds for every bedroom size and style.',
    },
    {
      name: 'Wardrobes',
      parent_id: savedParents.find((p) => p.name === 'Bedroom')?.id,
      description: 'Spacious wardrobes for efficient storage.',
    },
    {
      name: 'Office Chairs',
      parent_id: savedParents.find((p) => p.name === 'Office')?.id,
      description: 'Ergonomic chairs for comfort during work.',
    },
    {
      name: 'Outdoor Tables',
      parent_id: savedParents.find((p) => p.name === 'Outdoor')?.id,
      description: 'Weather-resistant tables for outdoor use.',
    },
  ];

  // Save child categories
  await queryRunner.manager.save(
    CategoryEntity,
    childCategories.map((cat) =>
      queryRunner.manager.create(CategoryEntity, cat),
    ),
  );

  console.log('✅ Category seeding completed successfully!');
};
