import { BadRequestException, PipeTransform } from '@nestjs/common';

import { FileConstraints } from '@shared/types';

export interface FileValidationPipeOptions extends Partial<FileConstraints> {
  required?: boolean;
}

export class FileValidationPipe implements PipeTransform {
  constructor(private options: FileValidationPipeOptions) {}

  transform(file: Express.Multer.File) {
    const { required = true, maxSize, allowedTypes, allowedExtensions } = this.options;

    if (!file) {
      if (required) throw new BadRequestException('Nenhum arquivo foi enviado.');
      return file;
    }

    if (maxSize && file.size > maxSize) {
      const MB = 1024 * 1024;
      throw new BadRequestException(`O tamanho do arquivo excede o limite de ${maxSize / MB} MB.`);
    }

    if (allowedTypes) {
      const mimeBase = file.mimetype.split(';')[0].trim();
      if (!allowedTypes.test(mimeBase)) {
        const expected = allowedExtensions?.join(', ') ?? allowedTypes.toString();
        throw new BadRequestException(`O tipo do arquivo é inválido. Tipos permitidos: ${expected}.`);
      }
    }

    return file;
  }
}
