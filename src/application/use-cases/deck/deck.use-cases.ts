import { Module } from '@nestjs/common';

import { DeckRepositoryModule } from '@database/typeorm/repository/deck/deck.repository';
import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';

import { CreateDeckUseCase } from './create-deck.use-case';
import { DeleteDeckUseCase } from './delete-deck.use-case';
import { FindDecksUseCase } from './find-decks.use-case';
import { FindOneDeckUseCase } from './find-one-deck.use-case';
import { UpdateDeckUseCase } from './update-deck.use-case';

@Module({
  imports: [DeckRepositoryModule, ResourceRepositoryModule],
  providers: [CreateDeckUseCase, FindDecksUseCase, FindOneDeckUseCase, UpdateDeckUseCase, DeleteDeckUseCase],
  exports: [CreateDeckUseCase, FindDecksUseCase, FindOneDeckUseCase, UpdateDeckUseCase, DeleteDeckUseCase]
})
export class DeckUseCasesModule {}
