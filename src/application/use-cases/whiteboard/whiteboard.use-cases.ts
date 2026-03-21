import { Module } from '@nestjs/common';

import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';
import { WhiteboardRepositoryModule } from '@database/typeorm/repository/whiteboard/whiteboard.repository';

import { CreateWhiteboardUseCase } from './create-whiteboard.use-case';
import { DeleteWhiteboardUseCase } from './delete-whiteboard.use-case';
import { FindOneWhiteboardUseCase } from './find-one-whiteboard.use-case';
import { FindWhiteboardsUseCase } from './find-whiteboards.use-case';
import { UpdateWhiteboardUseCase } from './update-whiteboard.use-case';

@Module({
  imports: [WhiteboardRepositoryModule, ResourceRepositoryModule],
  providers: [
    CreateWhiteboardUseCase,
    FindWhiteboardsUseCase,
    FindOneWhiteboardUseCase,
    UpdateWhiteboardUseCase,
    DeleteWhiteboardUseCase
  ],
  exports: [
    CreateWhiteboardUseCase,
    FindWhiteboardsUseCase,
    FindOneWhiteboardUseCase,
    UpdateWhiteboardUseCase,
    DeleteWhiteboardUseCase
  ]
})
export class WhiteboardUseCasesModule {}
