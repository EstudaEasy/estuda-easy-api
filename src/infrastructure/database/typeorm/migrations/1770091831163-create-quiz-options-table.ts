import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizOptionTable1770091831163 implements MigrationInterface {
  name = 'CreateQuizOptionTable1770091831163';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE quiz_options (
        id SERIAL NOT NULL,
        quiz_item_id INTEGER NOT NULL,
        text VARCHAR NOT NULL,
        is_correct BOOLEAN NOT NULL,
        position INTEGER NOT NULL,
        CONSTRAINT pk_quiz_options_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE quiz_options ADD CONSTRAINT fk_quiz_options_quiz_item_id 
      FOREIGN KEY (quiz_item_id) REFERENCES quiz_items(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE quiz_options DROP CONSTRAINT fk_quiz_options_quiz_item_id;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE quiz_options;
    `);
  }
}
