import { Module } from '@nestjs/common';

import { DiaryUseCasesModule } from '@application/use-cases/diary/diary.use-cases';

import { DiaryController } from './diary.controller';

@Module({
  imports: [DiaryUseCasesModule],
  controllers: [DiaryController]
})
export class DiaryModule {}
