import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const { npm_package_name: title, npm_package_description: description, npm_package_version: version } = process.env;

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(title || '')
    .setDescription(description || '')
    .setVersion(version || '')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);
}
