import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { setupSwagger } from '@core/docs/setup-swagger';
import { ExceptionFilter } from '@core/filters/exception.filter';

import { ApiModule } from './api.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule);
  const httpAdapterHost = app.get<HttpAdapterHost>(HttpAdapterHost);

  app.enableCors({ credentials: true, origin: true });
  app.useGlobalFilters(new ExceptionFilter(httpAdapterHost));
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
