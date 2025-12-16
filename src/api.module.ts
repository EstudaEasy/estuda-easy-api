import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { HttpModule } from '@presentation/http/http.module';
import { TypeOrmModule } from '@adapters/typeorm/typeorm.module';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule],
  providers: []
})
export class ApiModule {}
