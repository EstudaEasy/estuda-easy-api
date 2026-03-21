import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateTaskBodyDTO } from './create-task.dto';

export class UpdateTaskParamsDTO {
  @ApiProperty({
    description: 'ID da tarefa',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsNotEmpty()
  @IsUUID()
  taskId: string;
}

export class UpdateTaskBodyDTO extends PartialType(CreateTaskBodyDTO) {}
