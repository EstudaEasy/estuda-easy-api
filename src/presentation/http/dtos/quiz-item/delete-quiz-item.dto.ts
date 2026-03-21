import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive, IsUUID } from 'class-validator';

export class DeleteQuizItemParamsDTO {
  @ApiProperty({
    description: 'ID do quiz',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  quizId: string;

  @ApiProperty({ description: 'ID do item do quiz', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  quizItemId: number;
}
