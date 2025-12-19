import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1765835459931 implements MigrationInterface {
  name = 'CreateUserTable1765835459931';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TYPE users_role_enum AS ENUM('admin', 'user')
    `);

    await queryRunner.query(/*sql*/ `
      CREATE TABLE users (
        id SERIAL NOT NULL,
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        birthdate DATE,
        phone_number VARCHAR,
        photo_url VARCHAR,
        role users_role_enum NOT NULL DEFAULT 'user',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT uq_users_email UNIQUE (email),
        CONSTRAINT pk_users_id PRIMARY KEY (id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      DROP TABLE users;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TYPE users_role_enum;
    `);
  }
}
