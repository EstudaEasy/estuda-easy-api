import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFlashcardsTable1770091850000 implements MigrationInterface {
  name = 'CreateFlashcardsTable1770091850000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      CREATE TABLE flashcards (
        id SERIAL NOT NULL,
        deck_id UUID NOT NULL,
        front VARCHAR NOT NULL,
        back VARCHAR NOT NULL,
        position INTEGER NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT pk_flashcards_id PRIMARY KEY (id)
      );
    `);

    await queryRunner.query(/*sql*/ `
      ALTER TABLE flashcards ADD CONSTRAINT fk_flashcards_decks 
      FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE ON UPDATE NO ACTION;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/*sql*/ `
      ALTER TABLE flashcards DROP CONSTRAINT fk_flashcards_decks;
    `);

    await queryRunner.query(/*sql*/ `
      DROP TABLE flashcards;
    `);
  }
}
