import { Module } from '@nestjs/common';

import { AuthModule } from './controllers/auth/auth.module';
import { QuizModule } from './controllers/quiz/quiz.module';
import { QuizItemModule } from './controllers/quiz-item/quiz-item.module';
import { UserModule } from './controllers/user/user.module';

@Module({
  imports: [AuthModule, QuizModule, QuizItemModule, UserModule]
})
export class HttpModule {}
