import { QueryRunner } from 'typeorm';
import { BlogCategoryEntity } from 'src/modules/blog-category/entities/blog-category.entity';

export const seedBlogCategories = async (queryRunner: QueryRunner) => {
  console.log('📝 Running Blog Category Seed');

  const existing = await queryRunner.manager.find(BlogCategoryEntity);
  if (existing.length > 0) {
    console.log('⚠️ Blog categories already seeded, skipping...');
    return;
  }

  const blogCategories = [
    {
      name: 'Interior Design Tips',
      description:
        'Articles offering expert advice and trends in home interior design.',
    },
    {
      name: 'Furniture Care & Maintenance',
      description:
        'Guides to help you maintain and protect your furniture pieces.',
    },
    {
      name: 'Home Decor Inspiration',
      description:
        'Creative decor ideas to make your living space truly yours.',
    },
    {
      name: 'DIY Furniture Projects',
      description:
        'Step-by-step tutorials for creating custom furniture and decor.',
    },
    {
      name: 'Sustainable Living',
      description:
        'Learn about eco-friendly materials and sustainable furniture practices.',
    },
    {
      name: 'Office Space Setup',
      description: 'Tips for designing productive and ergonomic office spaces.',
    },
    {
      name: 'Outdoor Living Ideas',
      description:
        'Inspiration for patios, gardens, and outdoor relaxation setups.',
    },
    {
      name: 'Minimalist Lifestyle',
      description:
        'Discover how to live with less and create calm, clutter-free interiors.',
    },
    {
      name: 'Seasonal Styling',
      description: 'Ideas for refreshing your home decor for every season.',
    },
    {
      name: 'Smart Home Furniture',
      description:
        'Exploring furniture designs integrated with smart technology.',
    },
  ];

  await queryRunner.manager.save(
    BlogCategoryEntity,
    blogCategories.map((cat) =>
      queryRunner.manager.create(BlogCategoryEntity, cat),
    ),
  );

  console.log('✅ Blog Category seeding completed successfully!');
};
