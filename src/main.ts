import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './core/docs/setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule);

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
