import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class DeleteResourceShareParamsDTO {
  @ApiProperty({
    description: 'ID do compartilhamento',
    example: 1
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  shareId: number;
}
