import { Module } from '@nestjs/common';
import { ConfigModule } from '@config/config.module';
import { HttpModule } from '@presentation/http/http.module';
import { TypeOrmModule } from '@adapters/typeorm/typeorm.module';
import { CustomValidationPipe } from '@core/pipes/custom-validation.pipe';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule],
  providers: [{ provide: APP_PIPE, useClass: CustomValidationPipe }]
})
export class ApiModule {}
