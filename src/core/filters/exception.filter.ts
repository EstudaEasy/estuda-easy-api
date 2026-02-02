import {
  ExceptionFilter as NestExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
  Logger
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { Exception } from '@application/errors';
import { Lang } from '@core/types';

@Catch()
export class ExceptionFilter implements NestExceptionFilter {
  private readonly logger = new Logger(ExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Unknown error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = (exception.getResponse() as any).message;
      error = exception.name;
    }

    if (exception instanceof Exception) {
      const lang = this.detectLanguage(request);
      message = new Exception(exception.code, lang).message;
    }

    const responseBody = {
      statusCode,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest())
    };

    this.logger.error(exception);
    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }

  private detectLanguage(req?: Request): Lang {
    const acceptLanguage = req?.headers?.['accept-language']?.toLowerCase()?.trim();

    if (!acceptLanguage) return 'pt_BR';
    if (acceptLanguage.startsWith('en')) return 'en_US';
    if (acceptLanguage.startsWith('es')) return 'es_ES';
    if (acceptLanguage.startsWith('pt')) return 'pt_BR';

    return 'pt_BR';
  }
}
