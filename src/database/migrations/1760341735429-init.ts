import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1760341735429 implements MigrationInterface {
  name = 'Init1760341735429';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "parent_id" integer, "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1416a7fb33c4bc1167c5b06115" ON "categories" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_803808891b6e8128e40ed75b7f" ON "categories" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1084464054fa259ee8a0279b60" ON "categories" ("name", "parent_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_categories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "description" text, CONSTRAINT "UQ_adc3bc773ccf2fb6f073193fcf6" UNIQUE ("name"), CONSTRAINT "UQ_903a6ea496e83ba9bec10af5835" UNIQUE ("slug"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a176b739100e057522a10e36e0" ON "blog_categories" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2c324bc456e89e48f9f2464d85" ON "blog_categories" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_adc3bc773ccf2fb6f073193fcf" ON "blog_categories" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "active" boolean NOT NULL DEFAULT true, "title" character varying(200) NOT NULL, "description" text, "content" text, "category_id" integer, "image_id" integer, "author_id" integer NOT NULL, "slug" character varying(255), "name_tsv" tsvector, CONSTRAINT "UQ_7b18faaddd461656ff66f32e2d7" UNIQUE ("slug"), CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_aaacd28c70b0183d8b3345b080" ON "blogs" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_1d0cd055ad7f4e0ab0a46a39f8" ON "blogs" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "image" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "path" character varying(255) NOT NULL, "filename" character varying(255) NOT NULL, "mime" character varying(50) NOT NULL, "size" bigint, "type" character varying(100), "product_id" integer, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf154a48ac328edeb8167a1cd7" ON "image" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d66031207bb97bfd6fc53e8f57" ON "image" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_643e806cfd148c15e5d5982da7" ON "image" ("type") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dfac6399a9b7b8134c350af0b9" ON "image" ("type", "deleted_at") WHERE type = 'product_variants' AND deleted_at IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "colors" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(255) NOT NULL, "hexCode" character varying(7) NOT NULL, "description" text, CONSTRAINT "PK_3a62edc12d29307872ab1777ced" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10bc9e2aa7c01881cd1f02ec16" ON "colors" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61fb9349aae5a0b689f94a8db3" ON "colors" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cf12321fa0b7b9539e89c7dfeb" ON "colors" ("name") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_variants" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "color_id" integer, "image_id" integer, "product_id" integer, CONSTRAINT "REL_80810e665ba660ed25412c5b8a" UNIQUE ("image_id"), CONSTRAINT "PK_281e3f2c55652d6a22c0aa59fd7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_155c01468f41e508b5db2c5de1" ON "product_variants" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_eaad245682e9f8a3eb0f030e1b" ON "product_variants" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_281e3f2c55652d6a22c0aa59fd" ON "product_variants" ("id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name" character varying(100) NOT NULL, "description" character varying(200) NOT NULL, "category_id" integer NOT NULL, "quantity" integer NOT NULL, "dimensions" jsonb NOT NULL, "model_number" character varying(100), "secondary_material" character varying(100), "configuration" character varying(100), "upholstery_material" character varying(100), "upholstery_color" character varying(50), "filling_material" character varying(100), "finish_type" character varying(50), "adjustable_headrest" boolean, "max_load" integer, "sales_package" character varying(200), "origin_of_manufacture" character varying(30), "discountValue" numeric(10,2), "discount_start_date" TIMESTAMP, "discount_end_date" TIMESTAMP, "warranty_summary" text, "warranty_service_type" text, "covered_in_warranty" text, "not_covered_in_warranty" text, "domestic_warranty" text, "slug" character varying(255), "price" numeric(10,2), "name_tsv" tsvector, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_490cf2092412d5647d15316c9f" ON "products" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f534c8d1c88f519e8865c450fb" ON "products" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_ratings" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "is_approved" boolean NOT NULL DEFAULT false, "rating" smallint NOT NULL, "comment" text, "product_id" integer, "user_id" integer, "parent_id" integer, CONSTRAINT "PK_f8bd94404fc1d160bdb075dc435" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5eb1494ab71a00077f356139d8" ON "product_ratings" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ead0d94806e06b003b89f6ad77" ON "product_ratings" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "cart_id" integer NOT NULL, "product_id" integer NOT NULL, "variant_id" integer, "quantity" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d20cbd6ab6361f48d4a7a3d1ce" ON "cart_items" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0bd9872d335ace815a51a1d29f" ON "cart_items" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "total_price" numeric(10,2) NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "REL_f091e86a234693a49084b4c2c8" UNIQUE ("user_id"), CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_121778e635712659db02c7cbc6" ON "cart" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b968f19060a9af62784eb327fe" ON "cart" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "variant_id" integer, "product_name" character varying NOT NULL, "product_color" character varying NOT NULL, "model" character varying NOT NULL, "dimensions" jsonb NOT NULL DEFAULT '{}', "quantity" integer NOT NULL DEFAULT '1', "price" numeric(10,2) NOT NULL DEFAULT '0', "warranty_summary" text DEFAULT '', "warranty_service_type" text DEFAULT '', "covered_in_warranty" text DEFAULT '', "not_covered_in_warranty" text DEFAULT '', "domestic_warranty" text DEFAULT '', "product_image_id" integer, "varient_image_id" integer, CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_93da2ba8b760a219b7803815df" ON "order_items" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e72f2444c146ac93f9641c5625" ON "order_items" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "billing_addresses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(255) NOT NULL, "phoneNumber" character varying(20) NOT NULL, "address" character varying(255) NOT NULL, "city" character varying(100) NOT NULL, "country" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "streetAddress1" character varying(255) NOT NULL, "streetAddress2" character varying(255), "zipCode" character varying(20) NOT NULL, "default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_494b6f363341324138270070b6d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_384cc5ac80d2c9b1c901dcdcb8" ON "billing_addresses" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5e2bceb10cd1a9a21a85b39281" ON "billing_addresses" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."orders_status_enum" AS ENUM('ORDER_PENDING', 'ORDER_COMPLETED', 'ORDER_CANCELLED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "total_price" numeric(10,2) NOT NULL DEFAULT '0', "status" "public"."orders_status_enum" NOT NULL DEFAULT 'ORDER_PENDING', "billing_address_id" integer, "shipping_address_id" integer, CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0c6558969e948f24e400a385f5" ON "orders" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_23798b69243926bb87a599e6d0" ON "orders" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "shipping_addresses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "addressLine1" character varying(255) NOT NULL, "addressLine2" character varying(255), "city" character varying(100) NOT NULL, "state" character varying(100) NOT NULL, "postalCode" character varying(20) NOT NULL, "country" character varying(100) NOT NULL, "default" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_cced78984eddbbe24470f226692" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6d8288bf6348c9ff32ed28cfe0" ON "shipping_addresses" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff4db4ba69cd1a87a183414538" ON "shipping_addresses" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'marketing', 'customer')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(100) NOT NULL, "password" text NOT NULL, "verified" boolean NOT NULL DEFAULT false, "role" "public"."users_role_enum" NOT NULL DEFAULT 'customer', "password_changed_at" TIMESTAMP WITH TIME ZONE, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "stripe_customer_id" character varying, "image_id" integer, "cart_id" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_b1aae736b7c5d6925efa856352" UNIQUE ("image_id"), CONSTRAINT "REL_cbfb19ddc0218b26522f9fea2e" UNIQUE ("cart_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5661370756cd7553e25cc1a0be" ON "users" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e1bcae0971273abfb0be1d8834" ON "users" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `,
    );
    await queryRunner.query(
      `CREATE TABLE "wishlists" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "user_id" integer NOT NULL, "product_id" integer NOT NULL, "variant_id" integer, CONSTRAINT "PK_d0a37f2848c5d268d315325f359" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c72b364a0643e32b2ac566d5c0" ON "wishlists" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_f39c5724aa4e383106ec7cfa54" ON "wishlists" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."payments_provider_enum" AS ENUM('stripe', 'paypal', 'square')`,
    );
    await queryRunner.query(
      `CREATE TABLE "payments" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "provider" "public"."payments_provider_enum" NOT NULL, "providerTransactionId" character varying, "providerPaymentId" character varying, "metadata" jsonb, "description" character varying, "failureReason" character varying, CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c612dfd77dea74aae0d2e54526" ON "payments" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d1b60aeebff2214f42e6fa5f38" ON "payments" ("id", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "otp_entity" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "UserEntity_id" integer NOT NULL, "otp" character varying NOT NULL, "expires_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_af69f5d9d41ea2100820431b72e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fbecdbd55f912a0d593e357547" ON "otp_entity" ("id") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_67864fbd954691fc86cf4e4602" ON "otp_entity" ("id", "created_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_b324119dcb71e877cee411f7929" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_1f073a9f9720fe731423f1064cc" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "FK_d9459c0593a5ded32e378b881e6" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_8b91b27dcad5b2bdb13977a176d" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_80810e665ba660ed25412c5b8a6" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" ADD CONSTRAINT "FK_6343513e20e2deab45edfce1316" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_25a422fb6e1a8999db0d4854621" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" ADD CONSTRAINT "FK_a62bd35a869cdd9448865c06071" FOREIGN KEY ("parent_id") REFERENCES "product_ratings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_6385a745d9e12a89b859bb25623" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_ede780fc2b865d1d1323e598038" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "FK_f091e86a234693a49084b4c2c86" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a" FOREIGN KEY ("product_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e" FOREIGN KEY ("varient_image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_addresses" ADD CONSTRAINT "FK_2072c5b1b9dbb62e33d21889f54" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_67b8be57fc38bda573d2a8513ec" FOREIGN KEY ("shipping_address_id") REFERENCES "shipping_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_d5bda805951a38147cb93726a77" FOREIGN KEY ("billing_address_id") REFERENCES "billing_addresses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_addresses" ADD CONSTRAINT "FK_75ab21980cabc5be328df3e49cc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_b1aae736b7c5d6925efa8563527" FOREIGN KEY ("image_id") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_cbfb19ddc0218b26522f9fea2eb" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_b5e6331a1a7d61c25d7a25cab8f" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_2662acbb3868b1f0077fda61dd2" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" ADD CONSTRAINT "FK_cfcd97a9f1a9f6c9595e850ee9e" FOREIGN KEY ("variant_id") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "otp_entity" ADD CONSTRAINT "FK_ee867e84c4c561254a3c30990e1" FOREIGN KEY ("UserEntity_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "otp_entity" DROP CONSTRAINT "FK_ee867e84c4c561254a3c30990e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_cfcd97a9f1a9f6c9595e850ee9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_2662acbb3868b1f0077fda61dd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "wishlists" DROP CONSTRAINT "FK_b5e6331a1a7d61c25d7a25cab8f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_cbfb19ddc0218b26522f9fea2eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_b1aae736b7c5d6925efa8563527"`,
    );
    await queryRunner.query(
      `ALTER TABLE "shipping_addresses" DROP CONSTRAINT "FK_75ab21980cabc5be328df3e49cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_d5bda805951a38147cb93726a77"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_67b8be57fc38bda573d2a8513ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "billing_addresses" DROP CONSTRAINT "FK_2072c5b1b9dbb62e33d21889f54"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_192e8ac226b4a1a8b591757eb6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_e98ae2ca9cf03e3ce24aa471b0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" DROP CONSTRAINT "FK_f091e86a234693a49084b4c2c86"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_ede780fc2b865d1d1323e598038"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_6385a745d9e12a89b859bb25623"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_a62bd35a869cdd9448865c06071"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_25a422fb6e1a8999db0d4854621"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_ratings" DROP CONSTRAINT "FK_538c9489e98d4874e8db0c4cafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_6343513e20e2deab45edfce1316"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_80810e665ba660ed25412c5b8a6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_variants" DROP CONSTRAINT "FK_8b91b27dcad5b2bdb13977a176d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_d9459c0593a5ded32e378b881e6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_1f073a9f9720fe731423f1064cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" DROP CONSTRAINT "FK_b324119dcb71e877cee411f7929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_67864fbd954691fc86cf4e4602"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fbecdbd55f912a0d593e357547"`,
    );
    await queryRunner.query(`DROP TABLE "otp_entity"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d1b60aeebff2214f42e6fa5f38"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c612dfd77dea74aae0d2e54526"`,
    );
    await queryRunner.query(`DROP TABLE "payments"`);
    await queryRunner.query(`DROP TYPE "public"."payments_provider_enum"`);
    await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f39c5724aa4e383106ec7cfa54"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c72b364a0643e32b2ac566d5c0"`,
    );
    await queryRunner.query(`DROP TABLE "wishlists"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e1bcae0971273abfb0be1d8834"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5661370756cd7553e25cc1a0be"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ff4db4ba69cd1a87a183414538"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6d8288bf6348c9ff32ed28cfe0"`,
    );
    await queryRunner.query(`DROP TABLE "shipping_addresses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_23798b69243926bb87a599e6d0"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0c6558969e948f24e400a385f5"`,
    );
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5e2bceb10cd1a9a21a85b39281"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_384cc5ac80d2c9b1c901dcdcb8"`,
    );
    await queryRunner.query(`DROP TABLE "billing_addresses"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e72f2444c146ac93f9641c5625"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_93da2ba8b760a219b7803815df"`,
    );
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b968f19060a9af62784eb327fe"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_121778e635712659db02c7cbc6"`,
    );
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0bd9872d335ace815a51a1d29f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d20cbd6ab6361f48d4a7a3d1ce"`,
    );
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ead0d94806e06b003b89f6ad77"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_5eb1494ab71a00077f356139d8"`,
    );
    await queryRunner.query(`DROP TABLE "product_ratings"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_f534c8d1c88f519e8865c450fb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_490cf2092412d5647d15316c9f"`,
    );
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_281e3f2c55652d6a22c0aa59fd"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_eaad245682e9f8a3eb0f030e1b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_155c01468f41e508b5db2c5de1"`,
    );
    await queryRunner.query(`DROP TABLE "product_variants"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf12321fa0b7b9539e89c7dfeb"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_61fb9349aae5a0b689f94a8db3"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10bc9e2aa7c01881cd1f02ec16"`,
    );
    await queryRunner.query(`DROP TABLE "colors"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dfac6399a9b7b8134c350af0b9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_643e806cfd148c15e5d5982da7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d66031207bb97bfd6fc53e8f57"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cf154a48ac328edeb8167a1cd7"`,
    );
    await queryRunner.query(`DROP TABLE "image"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1d0cd055ad7f4e0ab0a46a39f8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_aaacd28c70b0183d8b3345b080"`,
    );
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_adc3bc773ccf2fb6f073193fcf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2c324bc456e89e48f9f2464d85"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a176b739100e057522a10e36e0"`,
    );
    await queryRunner.query(`DROP TABLE "blog_categories"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1084464054fa259ee8a0279b60"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_803808891b6e8128e40ed75b7f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_1416a7fb33c4bc1167c5b06115"`,
    );
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
