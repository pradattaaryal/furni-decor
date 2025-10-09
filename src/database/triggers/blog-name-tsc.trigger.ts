import { QueryRunner } from 'typeorm';

export const addBlogNameTsvTriggers = async (queryRunner: QueryRunner) => {
  // 1️⃣ Create or replace trigger function
  console.log('function running');
  await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_blog_title_tsv()
    RETURNS TRIGGER AS $$
    BEGIN
      BEGIN
        IF NEW.title IS NULL THEN
          NEW.name_tsv := NULL;
        ELSE
          NEW.name_tsv := to_tsvector('english', NEW.title);
        END IF;

        -- Update the timestamp
        NEW.updated_at := CURRENT_TIMESTAMP;

        RAISE NOTICE 'Blog tsvector trigger executed for: %', NEW.title;

        RETURN NEW;
      EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'Error in blog tsvector trigger: %', SQLERRM;
        RETURN NEW;
      END;
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
    WHEN (OLD.title IS DISTINCT FROM NEW.title)
    EXECUTE FUNCTION update_blog_title_tsv();
  `);
};
export const removeNameTsvTriggers = async (queryRunner: QueryRunner) => {
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_insert_blog ON blogs;`,
  );
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS before_update_blog ON blogs;`,
  );
  await queryRunner.query(`DROP FUNCTION IF EXISTS update_blog_title_tsv;`);
};