import { QueryRunner } from 'typeorm';
import { ShippingAddressEntity } from 'src/modules/shipping-address/entities/shipping-address.entity';

export const seedShippingAddresses = async (queryRunner: QueryRunner) => {
  console.log('📦 Running Shipping Address Seeder');

  const existing = await queryRunner.manager.find(ShippingAddressEntity, {
    where: { userId: 1 },
  });

  if (existing.length > 0) {
    console.log('⚠️ Shipping addresses for user 1 already seeded, skipping...');
    return;
  }

  const addresses = [
    {
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 101',
      city: 'Kathmandu',
      state: 'Bagmati',
      postalCode: '44600',
      country: 'Nepal',
      default: true,
    },
    {
      addressLine1: '456 Lakeside Road',
      city: 'Pokhara',
      state: 'Gandaki',
      postalCode: '33700',
      country: 'Nepal',
    },
    {
      addressLine1: '789 Hilltop Ave',
      city: 'Bhaktapur',
      state: 'Bagmati',
      postalCode: '44800',
      country: 'Nepal',
    },
    {
      addressLine1: '321 Riverside Lane',
      addressLine2: 'Floor 3',
      city: 'Lalitpur',
      state: 'Bagmati',
      postalCode: '44700',
      country: 'Nepal',
    },
    {
      addressLine1: '654 Garden Street',
      city: 'Biratnagar',
      state: 'Province 1',
      postalCode: '56600',
      country: 'Nepal',
    },
    {
      addressLine1: '987 Mountain Road',
      addressLine2: 'Unit 5B',
      city: 'Dharan',
      state: 'Province 1',
      postalCode: '56700',
      country: 'Nepal',
    },
    {
      addressLine1: '159 Coastal Drive',
      city: 'Janakpur',
      state: 'Province 2',
      postalCode: '45600',
      country: 'Nepal',
    },
    {
      addressLine1: '753 Riverbend Way',
      addressLine2: 'Apt 12',
      city: 'Chitwan',
      state: 'Bagmati',
      postalCode: '44200',
      country: 'Nepal',
    },
    {
      addressLine1: '852 Forest Path',
      city: 'Nepalgunj',
      state: 'Lumbini',
      postalCode: '21800',
      country: 'Nepal',
    },
    {
      addressLine1: '147 Sunrise Boulevard',
      addressLine2: 'Suite 7',
      city: 'Bharatpur',
      state: 'Bagmati',
      postalCode: '44201',
      country: 'Nepal',
    },
  ];

  const addressesWithUser = addresses.map((addr) =>
    queryRunner.manager.create(ShippingAddressEntity, { ...addr, userId: 1 }),
  );

  await queryRunner.manager.save(ShippingAddressEntity, addressesWithUser);

  console.log('✅ Shipping addresses seeding completed successfully!');
};
