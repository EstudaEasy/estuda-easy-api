import {
  Injectable,
  ValidationPipe,
  UnprocessableEntityException,
  ValidationError,
  ArgumentMetadata,
  Scope,
  Inject
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { Request } from 'express';

import { VALIDATION_ERROR_MESSAGES_EN_US } from '@core/langs/en_US/validation-error-messages.lang';
import { VALIDATION_ERROR_MESSAGES_ES_ES } from '@core/langs/es_ES/validation-error-messages.lang';
import { VALIDATION_ERROR_MESSAGES_PT_BR } from '@core/langs/pt-br/validation-error-messages.lang';
import { Lang, ValidatorConstraintKey } from '@core/types';

type ErrorMessage = {
  property: string;
  errors: string[];
};

@Injectable({ scope: Scope.REQUEST })
export class CustomValidationPipe extends ValidationPipe {
  private lang: Lang;

  private readonly translations: Record<Lang, Record<ValidatorConstraintKey, string>> = {
    es_ES: VALIDATION_ERROR_MESSAGES_ES_ES,
    en_US: VALIDATION_ERROR_MESSAGES_EN_US,
    pt_BR: VALIDATION_ERROR_MESSAGES_PT_BR
  };

  constructor(@Inject(REQUEST) private readonly request: Request) {
    super({
      whitelist: true,
      transform: true,
      exceptionFactory(errors) {
        return new UnprocessableEntityException(this.formatValidationErrors(errors));
      }
    });
  }

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    this.lang = this.detectLanguage(this.request);
    return super.transform(value, metadata);
  }

  private detectLanguage(req?: Request): Lang {
    const acceptLanguage = req?.headers?.['accept-language']?.toLowerCase()?.trim();

    if (!acceptLanguage) return 'pt_BR';
    if (acceptLanguage.startsWith('en')) return 'en_US';
    if (acceptLanguage.startsWith('es')) return 'es_ES';
    if (acceptLanguage.startsWith('pt')) return 'pt_BR';

    return 'pt_BR';
  }

  private formatValidationErrors(errors: ValidationError[], parentProperty: string = '') {
    const formatted: ErrorMessage[] = [];

    for (const error of errors) {
      const property = parentProperty ? `${parentProperty}.${error.property}` : error.property;

      if (error.constraints) {
        const messages = this.handleErrorMessages(error, property);
        formatted.push({ property, errors: messages });
      }
      if (error.children?.length) {
        const nestedErrors = this.formatValidationErrors(error.children, property);
        formatted.push(...nestedErrors);
      }
    }

    return formatted;
  }

  private getValidationMetadata(error: ValidationError, constraintKey: string): ValidationMetadata | undefined {
    if (!error.target) return undefined;

    const validationMeta = getMetadataStorage()
      .getTargetValidationMetadatas(error.target.constructor, error.target.constructor.name, true, false)
      .find((meta) => meta.propertyName === error.property && constraintKey === meta.name);

    return validationMeta;
  }

  private handleErrorMessages(error: ValidationError, property: string): string[] {
    const messages: string[] = [];

    for (const [constraintKey, defaultMessage] of Object.entries(error.constraints || {})) {
      const metadata = this.getValidationMetadata(error, constraintKey);
      const message = this.translateErrorMessage(property, defaultMessage, constraintKey, metadata);
      messages.push(message);
    }

    return messages;
  }

  private translateErrorMessage(
    property: string,
    defaultMessage: string,
    constraintKey: string,
    metadata?: ValidationMetadata
  ): string {
    const constraintValues = metadata?.constraints || [];
    const normalizedKey = this.normalizeConstraints(defaultMessage, constraintKey, constraintValues);

    let message: string | undefined;

    const translatedMessages = this.translations[this.lang];
    message = translatedMessages[normalizedKey as ValidatorConstraintKey];

    if (!message) {
      return defaultMessage;
    }

    if (metadata?.each) {
      if (this.lang === 'es_ES') message = message.replace('el campo', 'cada ítem del campo');
      if (this.lang === 'en_US') message = message.replace('the field', 'each value in');
      if (this.lang === 'pt_BR') message = message.replace('o campo', 'cada item do campo');
    }

    return message
      .replace('$property', property)
      .replace('$constraint1', String(constraintValues?.[0]) || '')
      .replace('$constraint2', String(constraintValues?.[1]) || '');
  }

  private normalizeConstraints(message: string, constraintKey: string, constraintValues: any[]) {
    if (constraintKey === 'isEnum') {
      if (!constraintValues[1]?.length) constraintValues[1] = constraintValues[0];
    }

    if (constraintKey === 'isNumber' && constraintValues[0]?.maxDecimalPlaces) {
      constraintValues[1] = constraintValues[0].maxDecimalPlaces;
      constraintKey = 'decimalPlaces';
    }

    return constraintKey;
  }
}
