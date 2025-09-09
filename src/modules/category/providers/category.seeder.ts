import { Injectable, OnModuleInit } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { MUSIC_SUB_CATEGORIES } from '../constants/music-category.constant';

@Injectable()
export class CategorySeederService implements OnModuleInit {
  constructor(private readonly categoryService: CategoryService) {}

  async onModuleInit() {
    await this.seedMusicCategory();
  }

  async seedMusicCategory() {
    try {
      // Check if music category already exists
      const existingMusic = await this.categoryService.getOne({
        options: { where: { name: 'music' } },
      });

      if (existingMusic) {
        console.log('Music category already exists, skipping seed');
        return;
      }

      // Create sub-categories first
      for (const genre of MUSIC_SUB_CATEGORIES) {
        await this.categoryService.create({
          name: genre,
        });
      }

      // Create main music category
      await this.categoryService.create({
        name: 'music',
      });

      console.log('Music genres seeded successfully');
    } catch (error) {
      console.error('Error seeding music categories:', error);
    }
  }
}
