import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { FILE_CONSTRAINTS } from '@shared/constants';

const { maxSize, allowedExtensions } = FILE_CONSTRAINTS.audio;
const maxSizeMB = maxSize / 1024 / 1024;
const allowedTypesStr = allowedExtensions.join(', ');

export class UpdateDiaryAudioParamsDTO {
  @ApiProperty({
    description: 'ID do diário',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  diaryId: string;
}

export class UpdateDiaryAudioBodyDTO {
  @ApiProperty({
    type: String,
    required: true,
    format: 'binary',
    description: `Arquivo de áudio (${allowedTypesStr}) com tamanho máximo de ${maxSizeMB}MB.`
  })
  file: Express.Multer.File;
}
