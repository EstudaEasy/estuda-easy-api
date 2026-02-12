import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString, Length } from 'class-validator';

import { TaskStatus } from '@domain/entities/task/task.interface';

export class CreateTaskBodyDTO {
  @ApiProperty({
    description: 'Nome da tarefa',
    example: 'Estudar matemática',
    minLength: 3,
    maxLength: 100
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da tarefa',
    example: 'Revisar álgebra linear e cálculo diferencial',
    maxLength: 255
  })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  description?: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING
  })
  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @ApiPropertyOptional({
    description: 'Data de início da tarefa',
    example: '2024-01-15T10:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de término da tarefa',
    example: '2024-01-20T18:00:00.000Z'
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}
