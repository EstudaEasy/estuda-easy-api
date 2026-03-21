import { PipeTransform } from '@nestjs/common';

import { Exception } from '@core/exceptions';
import { FileValidationErrorCodes } from '@core/pipes/errors';
import { FileConstraints } from '@shared/types';

export interface FileValidationPipeOptions extends Partial<FileConstraints> {
  required?: boolean;
}

export class FileValidationPipe implements PipeTransform {
  constructor(private options: FileValidationPipeOptions) {}

  transform(file: Express.Multer.File) {
    const { required = true, maxSize, allowedTypes, allowedExtensions } = this.options;

    if (!file) {
      if (required) throw new Exception(FileValidationErrorCodes.FILE_NOT_PROVIDED);
      return file;
    }

    if (maxSize && file.size > maxSize) {
      const MB = 1024 * 1024;
      throw new Exception(FileValidationErrorCodes.FILE_TOO_LARGE, { maxSize: maxSize / MB });
    }

    if (allowedTypes) {
      const mimeBase = file.mimetype.split(';')[0].trim();
      if (!allowedTypes.test(mimeBase)) {
        const expected = allowedExtensions?.join(', ') ?? allowedTypes.toString();
        throw new Exception(FileValidationErrorCodes.INVALID_FILE_TYPE, { expected });
      }
    }

    return file;
  }
}
