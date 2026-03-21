import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupsTable1770091760285 implements MigrationInterface {
  name = 'CreateGroupsTable1770091760285';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE groups (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        name VARCHAR NOT NULL,
        description VARCHAR,
        invite_code VARCHAR NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_groups_invite_code UNIQUE (invite_code),
        CONSTRAINT pk_groups_id PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP TABLE groups;
    `);
  }
}
