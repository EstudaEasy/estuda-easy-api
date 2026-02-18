import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDiariesTable1771448485670 implements MigrationInterface {
  name = 'CreateDiariesTable1771448485670';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE diaries (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        content VARCHAR NOT NULL,
        audio_url VARCHAR,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_diaries_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE diaries ADD CONSTRAINT fk_diaries_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE diaries ADD CONSTRAINT uq_diaries_resource_id UNIQUE (resource_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE diaries DROP CONSTRAINT fk_diaries_resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE diaries;
    `);
  }
}
