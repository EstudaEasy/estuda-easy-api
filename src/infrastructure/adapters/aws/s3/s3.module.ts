import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Config } from '@config/aws/s3/config';
import { S3Provider } from '@providers/s3/s3.provider';

@Module({
  providers: [
    {
      provide: S3Client,
      useFactory: (configService: ConfigService) => {
        const s3Config = configService.get<S3Config>('s3')!;
        return new S3Client(s3Config);
      },
      inject: [ConfigService]
    },
    S3Provider
  ],
  exports: [S3Provider]
})
export class S3Module {}
