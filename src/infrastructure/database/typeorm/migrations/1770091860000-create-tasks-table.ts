import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTable1770091860000 implements MigrationInterface {
  name = 'CreateTasksTable1770091860000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE tasks_status_enum AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE tasks (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        description VARCHAR,
        status tasks_status_enum NOT NULL DEFAULT 'pending',
        start_date TIMESTAMPTZ,
        end_date TIMESTAMPTZ,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_tasks_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE tasks ADD CONSTRAINT fk_tasks_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE tasks ADD CONSTRAINT uq_tasks_resource_id UNIQUE (resource_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE tasks DROP CONSTRAINT fk_tasks_resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE tasks;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE tasks_status_enum;
    `);
  }
}
