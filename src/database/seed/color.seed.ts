import { ColorEntity } from 'src/modules/color/entities/color.entity';
import { QueryRunner } from 'typeorm';

export const seedColors = async (queryRunner: QueryRunner) => {
  console.log('🌈 Running Color Seed');

  const existing = await queryRunner.manager.find(ColorEntity);
  if (existing.length > 0) {
    console.log('⚠️ Colors already seeded, skipping...');
    return;
  }

  const colors = [
    {
      name: 'Walnut Brown',
      hexCode: '#5D3A1A',
      description: 'Rich dark brown tone resembling natural walnut wood.',
    },
    {
      name: 'Ivory White',
      hexCode: '#FFFFF0',
      description:
        'Soft off-white color ideal for minimal and modern interiors.',
    },
    {
      name: 'Charcoal Gray',
      hexCode: '#36454F',
      description: 'Deep gray color that adds a touch of sophistication.',
    },
    {
      name: 'Olive Green',
      hexCode: '#808000',
      description: 'Muted green shade popular for natural-themed furniture.',
    },
    {
      name: 'Midnight Blue',
      hexCode: '#191970',
      description: 'Dark navy blue shade adding elegance to living spaces.',
    },
    {
      name: 'Beige Sand',
      hexCode: '#F5F5DC',
      description: 'Neutral beige shade perfect for warm, cozy interiors.',
    },
    {
      name: 'Rust Orange',
      hexCode: '#B7410E',
      description: 'Earthy orange shade ideal for accent furniture pieces.',
    },
    {
      name: 'Slate Black',
      hexCode: '#2F4F4F',
      description: 'Subtle black tone with a slate gray undertone.',
    },
    {
      name: 'Forest Green',
      hexCode: '#228B22',
      description: 'Vibrant deep green inspired by nature.',
    },
    {
      name: 'Blush Pink',
      hexCode: '#FFC0CB',
      description: 'Soft pastel pink tone great for contemporary decor.',
    },
  ];

  await queryRunner.manager.save(
    ColorEntity,
    colors.map((color) => queryRunner.manager.create(ColorEntity, color)),
  );

  console.log('✅ Color seeding completed successfully!');
};
