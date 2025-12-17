import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserSessionsTable1766009969095 implements MigrationInterface {
  name = 'CreateUserSessionsTable1766009969095';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE user_sessions (
        jti VARCHAR NOT NULL, 
        user_id integer NOT NULL, 
        ip_address inet NOT NULL, 
        expires_at TIMESTAMPTZ NOT NULL, 
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT PK_user_sessions PRIMARY KEY (jti)
      );
    `);

    await queryRunner.query(/*sql*/ `
      CREATE INDEX IX_user_sessions_user_id ON user_sessions(user_id) 
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE user_sessions ADD CONSTRAINT FK_user_sessions_user_id FOREIGN KEY (user_id) 
      REFERENCES users(id) ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE user_sessions DROP CONSTRAINT FK_user_sessions_user_id
    `);

    await queryRunner.query(/*sql*/ `
      DROP INDEX IX_user_sessions_user_id
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE user_sessions
    `);
  }
}
