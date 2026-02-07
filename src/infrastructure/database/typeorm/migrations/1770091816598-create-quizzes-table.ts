import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuizTable1770091816598 implements MigrationInterface {
  name = 'CreateQuizTable1770091816598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE quizzes (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        description VARCHAR,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_quizzes_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE quizzes ADD CONSTRAINT fk_quizzes_resource
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP TABLE quizzes;
    `);
  }
}
