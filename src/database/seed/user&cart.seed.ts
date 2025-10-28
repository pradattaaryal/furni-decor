import { QueryRunner } from 'typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CartEntity } from 'src/modules/cart/entities/cart.entity';
import * as bcrypt from 'bcrypt';

export const seedUsersWithCarts = async (queryRunner: QueryRunner) => {
  console.log('👤 Running User + Cart Seed');

  const existing = await queryRunner.manager.find(UserEntity);
  if (existing.length > 0) {
    console.log('⚠️ Users already seeded, skipping...');
    return;
  }

  const passwordHash1 = await bcrypt.hash('StrongP@ssw0rd', 10);
  const passwordHash2 = await bcrypt.hash('StrongP@ssw0rd', 10);

  const usersData = [
    {
      email: 'john.doe@example.com',
      password: passwordHash1,
      firstName: 'John',
      lastName: 'Doe',
      role: 'admin',
      verified: true,
      image_url: null,
    },
    {
      email: 'marketing@123.com',
      password: passwordHash1,
      firstName: 'marketing',
      lastName: 'marketing',
      role: 'marketing',
      verified: true,
      image_url: null,
    },
    {
      email: 'customer@123.com',
      password: passwordHash2,
      firstName: 'customer',
      lastName: 'customer',
      role: 'customer',
      verified: true,
      image_url: null,
    },
  ];

  const savedUsers = await queryRunner.manager.save(
    UserEntity,
    usersData.map((user) => queryRunner.manager.create(UserEntity, user)),
  );

  const carts = savedUsers.map((user) =>
    queryRunner.manager.create(CartEntity, {
      userId: user.id,
      totalPrice: 0,
      isActive: true,
    }),
  );

  const savedCarts = await queryRunner.manager.save(CartEntity, carts);

  // Step 3: Update users with their cart IDs (bi-directional link)
  for (let i = 0; i < savedUsers.length; i++) {
    savedUsers[i].cart = savedCarts[i];
    await queryRunner.manager.save(UserEntity, savedUsers[i]);
  }

  console.log('✅ User + Cart seeding completed successfully!');
};
