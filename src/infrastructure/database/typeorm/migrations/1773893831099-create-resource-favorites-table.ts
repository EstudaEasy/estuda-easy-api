import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateResourceFavoritesTable1773893831099 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE resource_favorites (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        user_id INTEGER NOT NULL,
        resource_id UUID NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_user_resource_favorite UNIQUE (user_id, resource_id),
        CONSTRAINT pk_resource_favorites_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_favorites ADD CONSTRAINT fk_resource_favorites_users
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_favorites ADD CONSTRAINT fk_resource_favorites_resources
      FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_favorites DROP CONSTRAINT fk_resource_favorites_resources;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE resource_favorites DROP CONSTRAINT fk_resource_favorites_users;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE resource_favorites;
    `);
  }
}
