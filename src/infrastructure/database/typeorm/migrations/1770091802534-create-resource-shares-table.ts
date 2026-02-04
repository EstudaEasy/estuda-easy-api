import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceSharesTable1770091802534 implements MigrationInterface {
  name = 'CreateResourceSharesTable1770091802534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE share_permission_enum AS ENUM('read', 'edit', 'admin')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE resource_shares (
        id SERIAL NOT NULL,
        permission share_permission_enum NOT NULL,
        resource_id UUID NOT NULL,
        group_id UUID,
        user_id INTEGER,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_resource_shares_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares ADD CONSTRAINT fk_resource_shares_resource
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares ADD CONSTRAINT fk_resource_shares_group
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares ADD CONSTRAINT fk_resource_shares_user
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares DROP CONSTRAINT fk_resource_shares_user;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares DROP CONSTRAINT fk_resource_shares_group;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_shares DROP CONSTRAINT fk_resource_shares_resource;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE resource_shares;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE share_permission_enum;
    `);
  }
}
