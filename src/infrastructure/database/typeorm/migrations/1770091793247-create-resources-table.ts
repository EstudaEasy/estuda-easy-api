import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourcesTable1770091793247 implements MigrationInterface {
  name = 'CreateResourcesTable1770091793247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE resources_type_enum AS ENUM('collection', 'diary', 'quiz', 'task', 'whiteboard')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE resources (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        type resources_type_enum NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_resources_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resources ADD CONSTRAINT fk_resources_users
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE resources DROP CONSTRAINT fk_resources_users;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE resources_type_enum;
    `);
  }
}
