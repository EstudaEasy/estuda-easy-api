import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWhiteboardsTable1770091870000 implements MigrationInterface {
  name = 'CreateWhiteboardsTable1770091870000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE whiteboards (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        title VARCHAR NOT NULL,
        content JSONB NOT NULL,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_whiteboards_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE whiteboards ADD CONSTRAINT fk_whiteboards_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE whiteboards ADD CONSTRAINT uq_whiteboards_resource_id UNIQUE (resource_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE whiteboards DROP CONSTRAINT fk_whiteboards_resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE whiteboards;
    `);
  }
}
