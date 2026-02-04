import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizItemTable1770091820312 implements MigrationInterface {
  name = 'CreateQuizItemTable1770091820312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE quiz_items (
        id SERIAL NOT NULL,
        quiz_id UUID NOT NULL,
        question VARCHAR NOT NULL,
        position INTEGER NOT NULL,
        time_limit FLOAT,
        explanation VARCHAR,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_quiz_items_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE quiz_items ADD CONSTRAINT fk_quiz_items_quiz_id 
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE quiz_items DROP CONSTRAINT fk_quiz_items_quiz_id;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE quiz_items;
    `);
  }
}
