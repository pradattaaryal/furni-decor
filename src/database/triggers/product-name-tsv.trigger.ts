import { QueryRunner } from 'typeorm';

export const addNameTsvTriggers = async (queryRunner: QueryRunner) => {
  // Create a robust trigger function with error handling
  await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_product_name_tsv()
    RETURNS TRIGGER AS $$
    BEGIN
      BEGIN
        -- Handle NULL case gracefully
        IF NEW.name IS NULL THEN
          NEW.name_tsv := NULL;
        ELSE
          NEW.name_tsv := to_tsvector('english', NEW.name);
        END IF;
        -- Update the timestamp to match the manual update zbehavior
        NEW.updated_at := CURRENT_TIMESTAMP;
        RAISE NOTICE 'Trigger executed: %', NEW.name;
        RETURN NEW;
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error in tsvector trigger: %', SQLERRM;
        RETURN NEW; -- Still return NEW to allow the operation to continue
      END;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Drop existing triggers to avoid conflicts
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_insert_product ON products;`,
  );
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_update_product ON products;`,
  );

  // Create trigger for before insert
  await queryRunner.query(`
    CREATE TRIGGER before_insert_product
    BEFORE INSERT ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_name_tsv();
  `);

  // Create trigger for before update (only when name changes)
  await queryRunner.query(`
    CREATE TRIGGER before_update_product
    BEFORE UPDATE ON products
    FOR EACH ROW
    EXECUTE FUNCTION update_product_name_tsv();
  `);
};

export const removeNameTsvTriggers = async (queryRunner: QueryRunner) => {
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_insert_product ON products;`,
  );
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_update_product ON products;`,
  );
  await queryRunner.query(`DROP FUNCTION IF EXISTS update_product_name_tsv;`);
};
