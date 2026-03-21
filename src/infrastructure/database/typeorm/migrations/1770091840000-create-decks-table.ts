import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDecksTable1770091840000 implements MigrationInterface {
  name = 'CreateDecksTable1770091840000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE decks (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        description VARCHAR,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_decks_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE decks ADD CONSTRAINT fk_decks_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE decks ADD CONSTRAINT uq_decks_resource_id UNIQUE (resource_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE decks DROP CONSTRAINT fk_decks_resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE decks;
    `);
  }
}
