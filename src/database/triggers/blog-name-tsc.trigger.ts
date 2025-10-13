import { QueryRunner } from 'typeorm';

export const addBlogNameTsvTriggers = async (queryRunner: QueryRunner) => {
  // 1️⃣ Create or replace the trigger function
  await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_blog_title_tsv()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.title IS NULL THEN
        NEW.name_tsv := NULL;
      ELSE
        NEW.name_tsv := to_tsvector('english', NEW.title);
      END IF;

      -- Keep the updated_at timestamp in sync
      NEW.updated_at := CURRENT_TIMESTAMP;

      RETURN NEW;
    EXCEPTION WHEN OTHERS THEN
      RAISE WARNING 'Error in blog tsvector trigger: %', SQLERRM;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // 2️⃣ Drop existing triggers to avoid conflicts
  await queryRunner.query(`DROP TRIGGER IF EXISTS before_insert_blog ON blogs;`);
  await queryRunner.query(`DROP TRIGGER IF EXISTS before_update_blog ON blogs;`);

  // 3️⃣ Create BEFORE INSERT trigger
  await queryRunner.query(`
    CREATE TRIGGER before_insert_blog
    BEFORE INSERT ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_title_tsv();
  `);

  // 4️⃣ Create BEFORE UPDATE trigger
  await queryRunner.query(`
    CREATE TRIGGER before_update_blog
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blog_title_tsv();
  `);

  // 5️⃣ Backfill existing rows so name_tsv is populated
  await queryRunner.query(`
    UPDATE blogs
    SET name_tsv = to_tsvector('english', title)
    WHERE name_tsv IS NULL;
  `);

  console.log('Blog name_tsv triggers created and existing rows backfilled.');
};
