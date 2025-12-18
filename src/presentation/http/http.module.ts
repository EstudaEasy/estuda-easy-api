import { Module } from '@nestjs/common';
import { AuthModule } from './controllers/auth/auth.module';
import { UserModule } from './controllers/user/user.module';

@Module({
  imports: [AuthModule, UserModule]
})
export class HttpModule {}
