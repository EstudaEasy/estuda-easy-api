import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { TaskStatus } from '@domain/entities/task/task.interface';

@Exclude()
export class TaskResponseDTO {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Nome da tarefa',
    example: 'Estudar matemática'
  })
  @Expose()
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição da tarefa',
    example: 'Revisar álgebra linear e cálculo diferencial'
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING
  })
  @Expose()
  status: TaskStatus;

  @ApiPropertyOptional({
    description: 'Data de início da tarefa',
    example: '2024-01-15T10:00:00.000Z'
  })
  @Expose()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Data de término da tarefa',
    example: '2024-01-20T18:00:00.000Z'
  })
  @Expose()
  endDate?: Date;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
