import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

import { ResourceType } from '@domain/resource/resource.interface';

import { DeckResponseDTO } from '../deck/deck-response.dto';
import { DiaryResponseDTO } from '../diary/diary-response.dto';
import { QuizResponseDTO } from '../quiz/quiz-response.dto';
import { TaskResponseDTO } from '../task/task-response.dto';
import { WhiteboardResponseDTO } from '../whiteboard/whiteboard-response.dto';

@Exclude()
export class ResourceResponseDTO {
  @ApiProperty({
    description: 'ID único do recurso',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Tipo do recurso favoritado',
    enum: ResourceType,
    example: ResourceType.DECK
  })
  @Expose()
  type: ResourceType;

  @ApiProperty({
    description: 'ID do usuário dono do recurso',
    example: 10
  })
  @Expose()
  userId: number;

  @ApiPropertyOptional({
    description: 'Dados do deck, quando o tipo do recurso for deck',
    type: DeckResponseDTO
  })
  @Expose()
  @Type(() => DeckResponseDTO)
  deck?: DeckResponseDTO;

  @ApiPropertyOptional({
    description: 'Dados do diário, quando o tipo do recurso for diary',
    type: DiaryResponseDTO
  })
  @Expose()
  @Type(() => DiaryResponseDTO)
  diary?: DiaryResponseDTO;

  @ApiPropertyOptional({
    description: 'Dados do quiz, quando o tipo do recurso for quiz',
    type: QuizResponseDTO
  })
  @Expose()
  @Type(() => QuizResponseDTO)
  quiz?: QuizResponseDTO;

  @ApiPropertyOptional({
    description: 'Dados da tarefa, quando o tipo do recurso for task',
    type: TaskResponseDTO
  })
  @Expose()
  @Type(() => TaskResponseDTO)
  task?: TaskResponseDTO;

  @ApiPropertyOptional({
    description: 'Dados do whiteboard, quando o tipo do recurso for whiteboard',
    type: WhiteboardResponseDTO
  })
  @Expose()
  @Type(() => WhiteboardResponseDTO)
  whiteboard?: WhiteboardResponseDTO;

  @ApiProperty({
    description: 'Data de criação do recurso',
    example: '2026-01-15T10:30:00.000Z'
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do recurso',
    example: '2026-01-15T10:30:00.000Z'
  })
  @Expose()
  updatedAt: Date;
}
