import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ResourceType } from '@domain/resource/resource.interface';

export class ConvertResourceResponseDTO {
  @ApiProperty({ description: 'Dados do novo recurso gerado. O formato varia de acordo com o tipo do recurso.' })
  @Expose()
  data: any;

  @ApiProperty({
    description: 'Tipo do novo recurso gerado',
    enum: ResourceType,
    example: ResourceType.QUIZ
  })
  @Expose()
  type: ResourceType;
}
