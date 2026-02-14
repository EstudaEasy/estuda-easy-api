import { Module } from '@nestjs/common';

import { AuthModule } from './controllers/auth/auth.module';
import { GroupModule } from './controllers/group/group.module';
import { GroupMemberModule } from './controllers/group-member/group-member.module';
import { QuizModule } from './controllers/quiz/quiz.module';
import { QuizItemModule } from './controllers/quiz-item/quiz-item.module';
import { TaskModule } from './controllers/task/task.module';
import { UserModule } from './controllers/user/user.module';
import { WhiteboardModule } from './controllers/whiteboard/whiteboard.module';

@Module({
  imports: [
    AuthModule,
    GroupModule,
    GroupMemberModule,
    QuizModule,
    QuizItemModule,
    TaskModule,
    UserModule,
    WhiteboardModule
  ]
})
export class HttpModule {}
