import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateGroupMembersTable1770091777602 implements MigrationInterface {
  name = 'CreateGroupMembersTable1770091777602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE group_members_role_enum AS ENUM('owner', 'admin', 'member')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE group_members (
        id SERIAL NOT NULL,
        role group_members_role_enum NOT NULL,
        group_id UUID NOT NULL,
        user_id INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_group_members_user_group UNIQUE (user_id, group_id),
        CONSTRAINT pk_group_members_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_members ADD CONSTRAINT fk_group_members_group
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_members ADD CONSTRAINT fk_group_members_user
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_members DROP CONSTRAINT fk_group_members_user;
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE group_members DROP CONSTRAINT fk_group_members_group;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE group_members;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE group_members_role_enum;
    `);
  }
}
