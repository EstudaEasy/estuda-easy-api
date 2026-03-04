import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceShareLinksTable1772581947751 implements MigrationInterface {
  name = 'CreateResourceShareLinksTable1772581947751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE resource_share_links (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        resource_id UUID NOT NULL,
        permission share_permission_enum NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_resource_share_links_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_share_links ADD CONSTRAINT fk_share_links_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_share_links ADD CONSTRAINT uq_resource_share_links_resource_id UNIQUE (resource_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_share_links DROP CONSTRAINT uq_resource_share_links_resource_id;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_share_links DROP CONSTRAINT fk_share_links_resources;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE resource_share_links;
    `);
  }
}
