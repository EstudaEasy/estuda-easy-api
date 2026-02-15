import { Module } from '@nestjs/common';

import { WhiteboardUseCasesModule } from '@application/use-cases/whiteboard/whiteboard.use-cases';
import { WhiteboardController } from '@presentation/http/controllers/whiteboard/whiteboard.controller';

@Module({
  imports: [WhiteboardUseCasesModule],
  controllers: [WhiteboardController]
})
export class WhiteboardModule {}
