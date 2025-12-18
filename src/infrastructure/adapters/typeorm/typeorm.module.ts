import { TypeOrmConfig } from '@config/typeorm/config';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule as NestTypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    NestTypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.getOrThrow<TypeOrmConfig>('typeorm');
      }
    })
  ]
})
export class TypeOrmModule {}
