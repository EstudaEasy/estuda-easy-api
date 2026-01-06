import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

import { TypeOrmModule } from '@adapters/typeorm/typeorm.module';
import { ConfigModule } from '@config/config.module';
import { CustomValidationPipe } from '@core/pipes/custom-validation.pipe';
import { HttpModule } from '@presentation/http/http.module';

@Module({
  imports: [ConfigModule, HttpModule, TypeOrmModule],
  providers: [{ provide: APP_PIPE, useClass: CustomValidationPipe }]
})
export class ApiModule {}
