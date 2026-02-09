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

import { CreateFlashcardUseCase } from '@application/use-cases/flashcard/create-flashcard.use-case';
import { DeleteFlashcardUseCase } from '@application/use-cases/flashcard/delete-flashcard.use-case';
import { FindFlashcardsUseCase } from '@application/use-cases/flashcard/find-flashcards.use-case';
import { FindOneFlashcardUseCase } from '@application/use-cases/flashcard/find-one-flashcard.use-case';
import { UpdateFlashcardUseCase } from '@application/use-cases/flashcard/update-flashcard.use-case';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';

import {
  CreateFlashcardBodyDTO,
  CreateFlashcardParamsDTO,
  FindOneFlashcardParamsDTO,
  UpdateFlashcardParamsDTO,
  DeleteFlashcardParamsDTO,
  FlashcardResponseDTO,
  FindFlashcardQueryDTO,
  FindFlashcardResponseDTO,
  UpdateFlashcardBodyDTO,
  FindFlashcardParamsDTO
} from '../../dtos/flashcard';

@Auth()
@ApiTags('Decks e Flashcards')
@Controller('decks/:deckId/flashcards')
@UseInterceptors(ClassSerializerInterceptor)
export class FlashcardController {
  constructor(
    private readonly createFlashcardUseCase: CreateFlashcardUseCase,
    private readonly findOneFlashcardUseCase: FindOneFlashcardUseCase,
    private readonly findFlashcardsUseCase: FindFlashcardsUseCase,
    private readonly updateFlashcardUseCase: UpdateFlashcardUseCase,
    private readonly deleteFlashcardUseCase: DeleteFlashcardUseCase
  ) {}

  @Post()
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'deckId')
  @SerializeOptions({ type: FlashcardResponseDTO })
  @ApiOperation({ summary: 'Criar um novo flashcard' })
  @ApiCreatedResponse({ description: 'Flashcard criado com sucesso', type: FlashcardResponseDTO })
  async create(
    @Param() params: CreateFlashcardParamsDTO,
    @Body() body: CreateFlashcardBodyDTO
  ): Promise<FlashcardResponseDTO> {
    return await this.createFlashcardUseCase.execute({ data: { ...body, deckId: params.deckId } });
  }

  @Get()
  @SerializeOptions({ type: FindFlashcardResponseDTO })
  @ApiOperation({ summary: 'Buscar flashcards de um deck' })
  @ApiOkResponse({ description: 'Flashcards retornados com sucesso', type: FindFlashcardResponseDTO })
  async find(
    @Param() params: FindFlashcardParamsDTO,
    @Query() filters: FindFlashcardQueryDTO
  ): Promise<FindFlashcardResponseDTO> {
    return await this.findFlashcardsUseCase.execute({
      filters: { ...filters, deckId: params.deckId }
    });
  }

  @Get(':flashcardId')
  @SerializeOptions({ type: FlashcardResponseDTO })
  @ApiOperation({ summary: 'Buscar um flashcard por ID' })
  @ApiOkResponse({ description: 'Flashcard encontrado', type: FlashcardResponseDTO })
  @ApiNotFoundResponse({ description: 'Flashcard não encontrado' })
  async findOne(@Param() params: FindOneFlashcardParamsDTO): Promise<FlashcardResponseDTO> {
    return await this.findOneFlashcardUseCase.execute({
      filters: { id: params.flashcardId, deckId: params.deckId }
    });
  }

  @Patch(':flashcardId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'deckId')
  @SerializeOptions({ type: FlashcardResponseDTO })
  @ApiOperation({ summary: 'Atualizar um flashcard' })
  @ApiOkResponse({ description: 'Flashcard atualizado com sucesso', type: FlashcardResponseDTO })
  @ApiNotFoundResponse({ description: 'Flashcard não encontrado' })
  async update(
    @Param() params: UpdateFlashcardParamsDTO,
    @Body() body: UpdateFlashcardBodyDTO
  ): Promise<FlashcardResponseDTO> {
    return await this.updateFlashcardUseCase.execute({
      filters: { id: params.flashcardId, deckId: params.deckId },
      data: body
    });
  }

  @Delete(':flashcardId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'deckId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um flashcard' })
  @ApiNoContentResponse({ description: 'Flashcard deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Flashcard não encontrado' })
  async delete(@Param() params: DeleteFlashcardParamsDTO): Promise<void> {
    return await this.deleteFlashcardUseCase.execute({
      filters: { id: params.flashcardId, deckId: params.deckId }
    });
  }
}
