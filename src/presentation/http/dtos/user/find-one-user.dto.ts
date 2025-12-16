import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class FindOneUserParamsDTO {
  @ApiProperty({ description: 'ID do usuário', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  userId: number;
}
