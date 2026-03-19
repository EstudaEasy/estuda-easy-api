import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupPostsTable1773888732662 implements MigrationInterface {
  name = 'CreateGroupPostsTable1773888732662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE group_posts (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        group_id UUID NOT NULL,
        author_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_group_posts_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_groups
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_users
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_posts DROP CONSTRAINT fk_group_posts_users;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_posts DROP CONSTRAINT fk_group_posts_groups;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE group_posts;
    `);
  }
}
