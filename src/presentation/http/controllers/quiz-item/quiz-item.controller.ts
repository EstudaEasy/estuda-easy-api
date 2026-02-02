import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';

import { CreateQuizItemUseCase } from '@application/use-cases/quiz-item/create-quiz-item.use-case';
import { DeleteQuizItemUseCase } from '@application/use-cases/quiz-item/delete-quiz-item.use-case';
import { FindOneQuizItemUseCase } from '@application/use-cases/quiz-item/find-one-quiz-item.use-case';
import { FindQuizItemsUseCase } from '@application/use-cases/quiz-item/find-quiz-items.use-case';
import { UpdateQuizItemUseCase } from '@application/use-cases/quiz-item/update-quiz-item.use-case';

import {
  CreateQuizItemBodyDTO,
  FindOneQuizItemParamsDTO,
  UpdateQuizItemParamsDTO,
  DeleteQuizItemParamsDTO,
  QuizItemResponseDTO,
  FindQuizItemQueryDTO,
  FindQuizItemResponseDTO,
  UpdateQuizItemBodyDTO,
  CreateQuizItemParamsDTO,
  FindQuizItemParamsDTO
} from '../../dtos/quiz-item';

@ApiTags('Quizzes')
@Controller('quizzes/:quizId/items')
@UseInterceptors(ClassSerializerInterceptor)
export class QuizItemController {
  constructor(
    private readonly createQuizItemUseCase: CreateQuizItemUseCase,
    private readonly findOneQuizItemUseCase: FindOneQuizItemUseCase,
    private readonly findQuizItemsUseCase: FindQuizItemsUseCase,
    private readonly updateQuizItemUseCase: UpdateQuizItemUseCase,
    private readonly deleteQuizItemUseCase: DeleteQuizItemUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: QuizItemResponseDTO })
  @ApiOperation({ summary: 'Criar um novo item de quiz' })
  @ApiCreatedResponse({ description: 'Item criado com sucesso', type: QuizItemResponseDTO })
  async create(
    @Param() params: CreateQuizItemParamsDTO,
    @Body() body: CreateQuizItemBodyDTO
  ): Promise<QuizItemResponseDTO> {
    return await this.createQuizItemUseCase.execute({ data: { ...body, quizId: params.quizId } });
  }

  @Get()
  @SerializeOptions({ type: FindQuizItemResponseDTO })
  @ApiOperation({ summary: 'Buscar itens de quiz' })
  @ApiOkResponse({ description: 'Itens retornados com sucesso', type: FindQuizItemResponseDTO })
  async find(
    @Param() params: FindQuizItemParamsDTO,
    @Query() filters: FindQuizItemQueryDTO
  ): Promise<FindQuizItemResponseDTO> {
    return await this.findQuizItemsUseCase.execute({
      filters: { ...filters, quizId: params.quizId },
      relations: { options: true }
    });
  }

  @Get(':quizItemId')
  @SerializeOptions({ type: QuizItemResponseDTO })
  @ApiOperation({ summary: 'Buscar um item de quiz por ID' })
  @ApiOkResponse({ description: 'Item encontrado', type: QuizItemResponseDTO })
  @ApiNotFoundResponse({ description: 'Item não encontrado' })
  async findOne(@Param() params: FindOneQuizItemParamsDTO): Promise<QuizItemResponseDTO> {
    return await this.findOneQuizItemUseCase.execute({
      filters: { id: params.quizItemId, quizId: params.quizId },
      relations: { options: true }
    });
  }

  @Patch(':quizItemId')
  @SerializeOptions({ type: QuizItemResponseDTO })
  @ApiOperation({
    summary: 'Atualizar um item de quiz',
    description: 'Mantém as opções existentes se nenhuma for fornecida'
  })
  @ApiOkResponse({ description: 'Item atualizado com sucesso', type: QuizItemResponseDTO })
  @ApiNotFoundResponse({ description: 'Item não encontrado' })
  async update(
    @Param() params: UpdateQuizItemParamsDTO,
    @Body() body: UpdateQuizItemBodyDTO
  ): Promise<QuizItemResponseDTO> {
    return await this.updateQuizItemUseCase.execute({
      filters: { id: params.quizItemId, quizId: params.quizId },
      data: body
    });
  }

  @Delete(':quizItemId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um item de quiz' })
  @ApiNoContentResponse({ description: 'Item deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Item não encontrado' })
  async delete(@Param() params: DeleteQuizItemParamsDTO): Promise<void> {
    return await this.deleteQuizItemUseCase.execute({
      filters: { id: params.quizItemId, quizId: params.quizId }
    });
  }
}
