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

import { CreateQuizUseCase } from '@application/use-cases/quiz/create-quiz.use-case';
import { DeleteQuizUseCase } from '@application/use-cases/quiz/delete-quiz.use-case';
import { FindOneQuizUseCase } from '@application/use-cases/quiz/find-one-quiz.use-case';
import { FindQuizzesUseCase } from '@application/use-cases/quiz/find-quizzes.use-case';
import { UpdateQuizUseCase } from '@application/use-cases/quiz/update-quiz.use-case';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateQuizBodyDTO,
  FindOneQuizParamsDTO,
  UpdateQuizParamsDTO,
  DeleteQuizParamsDTO,
  QuizResponseDTO,
  FindQuizQueryDTO,
  FindQuizResponseDTO,
  UpdateQuizBodyDTO
} from '../../dtos/quiz';

@Auth()
@ApiTags('Quizzes')
@Controller('quizzes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuizController {
  constructor(
    private readonly createQuizUseCase: CreateQuizUseCase,
    private readonly findOneQuizUseCase: FindOneQuizUseCase,
    private readonly findQuizzesUseCase: FindQuizzesUseCase,
    private readonly updateQuizUseCase: UpdateQuizUseCase,
    private readonly deleteQuizUseCase: DeleteQuizUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: QuizResponseDTO })
  @ApiOperation({ summary: 'Criar um novo quiz' })
  @ApiCreatedResponse({ description: 'Quiz criado com sucesso', type: QuizResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateQuizBodyDTO): Promise<QuizResponseDTO> {
    return await this.createQuizUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindQuizResponseDTO })
  @ApiOperation({ summary: 'Buscar quizzes' })
  @ApiOkResponse({ description: 'Quizzes retornados com sucesso', type: FindQuizResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindQuizQueryDTO): Promise<FindQuizResponseDTO> {
    return await this.findQuizzesUseCase.execute({
      filters: { ...filters, resource: { userId } },
      relations: { items: { options: true } }
    });
  }

  @Get('shared')
  @SerializeOptions({ type: FindQuizResponseDTO })
  @ApiOperation({ summary: 'Buscar quizzes compartilhados com o usuário' })
  @ApiOkResponse({ description: 'Quizzes retornados com sucesso', type: FindQuizResponseDTO })
  async findShared(@User('id') userId: number, @Query() filters: FindQuizQueryDTO): Promise<FindQuizResponseDTO> {
    return await this.findQuizzesUseCase.execute({
      filters: { ...filters, resource: { shares: { userId } } },
      relations: { items: { options: true } }
    });
  }

  @Get(':quizId')
  @SerializeOptions({ type: QuizResponseDTO })
  @ApiOperation({ summary: 'Buscar um quiz por ID' })
  @ApiOkResponse({ description: 'Quiz encontrado', type: QuizResponseDTO })
  @ApiNotFoundResponse({ description: 'Quiz não encontrado' })
  async findOne(@Param() params: FindOneQuizParamsDTO): Promise<QuizResponseDTO> {
    return await this.findOneQuizUseCase.execute({
      filters: { id: params.quizId },
      relations: { items: { options: true } }
    });
  }

  @Patch(':quizId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'quizId')
  @SerializeOptions({ type: QuizResponseDTO })
  @ApiOperation({ summary: 'Atualizar um quiz' })
  @ApiOkResponse({ description: 'Quiz atualizado com sucesso', type: QuizResponseDTO })
  @ApiNotFoundResponse({ description: 'Quiz não encontrado' })
  async update(@Param() params: UpdateQuizParamsDTO, @Body() data: UpdateQuizBodyDTO): Promise<QuizResponseDTO> {
    return await this.updateQuizUseCase.execute({ filters: { id: params.quizId }, data });
  }

  @Delete(':quizId')
  @ResourcePermission([], 'quizId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um quiz' })
  @ApiNoContentResponse({ description: 'Quiz deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Quiz não encontrado' })
  async delete(@Param() params: DeleteQuizParamsDTO): Promise<void> {
    return await this.deleteQuizUseCase.execute({ filters: { id: params.quizId } });
  }
}
