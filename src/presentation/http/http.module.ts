import { Module } from '@nestjs/common';
import { UserModule } from './controllers/user/user.module';

@Module({
  imports: [UserModule]
})
export class HttpModule {}
