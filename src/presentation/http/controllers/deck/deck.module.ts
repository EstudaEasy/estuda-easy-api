import { Module } from '@nestjs/common';

import { DeckUseCasesModule } from '@application/use-cases/deck/deck.use-cases';
import { DeckController } from '@presentation/http/controllers/deck/deck.controller';

@Module({
  imports: [DeckUseCasesModule],
  controllers: [DeckController]
})
export class DeckModule {}
