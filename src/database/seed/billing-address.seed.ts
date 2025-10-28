import { QueryRunner } from 'typeorm';
import { BillingAddressEntity } from 'src/modules/billing-address/entities/billing-address.entity';

export const seedBillingAddresses = async (queryRunner: QueryRunner) => {
  console.log('💳 Running Billing Address Seeder');

  const existing = await queryRunner.manager.find(BillingAddressEntity, {
    where: { userId: 1 },
  });

  if (existing.length > 0) {
    console.log('⚠️ Billing addresses for user 1 already seeded, skipping...');
    return;
  }

  const addresses = [
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+977980000001',
      address: '123 Main Street, Apt 101',
      streetAddress1: '123 Main Street',
      streetAddress2: 'Apt 101',
      city: 'Kathmandu',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44600',
      default: true,
    },
    {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phoneNumber: '+977980000002',
      address: '456 Lakeside Road, Suite 202',
      streetAddress1: '456 Lakeside Road',
      streetAddress2: 'Suite 202',
      city: 'Pokhara',
      state: 'Gandaki',
      country: 'Nepal',
      zipCode: '33700',
    },
    {
      firstName: 'Robert',
      lastName: 'Shrestha',
      email: 'robert.shrestha@example.com',
      phoneNumber: '+977980000003',
      address: '789 Hilltop Ave',
      streetAddress1: '789 Hilltop Ave',
      city: 'Bhaktapur',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44800',
    },
    {
      firstName: 'Anita',
      lastName: 'Gurung',
      email: 'anita.gurung@example.com',
      phoneNumber: '+977980000004',
      address: '321 Riverside Lane, Floor 3',
      streetAddress1: '321 Riverside Lane',
      streetAddress2: 'Floor 3',
      city: 'Lalitpur',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44700',
    },
    {
      firstName: 'Suman',
      lastName: 'Thapa',
      email: 'suman.thapa@example.com',
      phoneNumber: '+977980000005',
      address: '654 Garden Street',
      streetAddress1: '654 Garden Street',
      city: 'Biratnagar',
      state: 'Province 1',
      country: 'Nepal',
      zipCode: '56600',
    },
    {
      firstName: 'Priya',
      lastName: 'Rai',
      email: 'priya.rai@example.com',
      phoneNumber: '+977980000006',
      address: '987 Mountain Road, Unit 5B',
      streetAddress1: '987 Mountain Road',
      streetAddress2: 'Unit 5B',
      city: 'Dharan',
      state: 'Province 1',
      country: 'Nepal',
      zipCode: '56700',
    },
    {
      firstName: 'Bikash',
      lastName: 'Khatri',
      email: 'bikash.khatri@example.com',
      phoneNumber: '+977980000007',
      address: '159 Coastal Drive',
      streetAddress1: '159 Coastal Drive',
      city: 'Janakpur',
      state: 'Province 2',
      country: 'Nepal',
      zipCode: '45600',
    },
    {
      firstName: 'Rekha',
      lastName: 'Malla',
      email: 'rekha.malla@example.com',
      phoneNumber: '+977980000008',
      address: '753 Riverbend Way, Apt 12',
      streetAddress1: '753 Riverbend Way',
      streetAddress2: 'Apt 12',
      city: 'Chitwan',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44200',
    },
    {
      firstName: 'Kumar',
      lastName: 'Adhikari',
      email: 'kumar.adhikari@example.com',
      phoneNumber: '+977980000009',
      address: '852 Forest Path',
      streetAddress1: '852 Forest Path',
      city: 'Nepalgunj',
      state: 'Lumbini',
      country: 'Nepal',
      zipCode: '21800',
    },
    {
      firstName: 'Sita',
      lastName: 'Bhandari',
      email: 'sita.bhandari@example.com',
      phoneNumber: '+977980000010',
      address: '147 Sunrise Boulevard, Suite 7',
      streetAddress1: '147 Sunrise Boulevard',
      streetAddress2: 'Suite 7',
      city: 'Bharatpur',
      state: 'Bagmati',
      country: 'Nepal',
      zipCode: '44201',
    },
  ];

  const addressesWithUser = addresses.map((addr) =>
    queryRunner.manager.create(BillingAddressEntity, { ...addr, userId: 1 }),
  );

  await queryRunner.manager.save(BillingAddressEntity, addressesWithUser);

  console.log('✅ Billing addresses seeding completed successfully!');
};
