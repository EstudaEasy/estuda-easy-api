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

import { CreateDeckUseCase } from '@application/use-cases/deck/create-deck.use-case';
import { DeleteDeckUseCase } from '@application/use-cases/deck/delete-deck.use-case';
import { FindDecksUseCase } from '@application/use-cases/deck/find-decks.use-case';
import { FindOneDeckUseCase } from '@application/use-cases/deck/find-one-deck.use-case';
import { UpdateDeckUseCase } from '@application/use-cases/deck/update-deck.use-case';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateDeckBodyDTO,
  FindOneDeckParamsDTO,
  UpdateDeckParamsDTO,
  DeleteDeckParamsDTO,
  DeckResponseDTO,
  FindDeckQueryDTO,
  FindDeckResponseDTO,
  UpdateDeckBodyDTO
} from '../../dtos/deck';

@Auth()
@ApiTags('Decks e Flashcards')
@Controller('decks')
@UseInterceptors(ClassSerializerInterceptor)
export class DeckController {
  constructor(
    private readonly createDeckUseCase: CreateDeckUseCase,
    private readonly findOneDeckUseCase: FindOneDeckUseCase,
    private readonly findDecksUseCase: FindDecksUseCase,
    private readonly updateDeckUseCase: UpdateDeckUseCase,
    private readonly deleteDeckUseCase: DeleteDeckUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: DeckResponseDTO })
  @ApiOperation({ summary: 'Criar um novo deck' })
  @ApiCreatedResponse({ description: 'Deck criado com sucesso', type: DeckResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateDeckBodyDTO): Promise<DeckResponseDTO> {
    return await this.createDeckUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindDeckResponseDTO })
  @ApiOperation({ summary: 'Buscar decks' })
  @ApiOkResponse({ description: 'Decks retornados com sucesso', type: FindDeckResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindDeckQueryDTO): Promise<FindDeckResponseDTO> {
    return await this.findDecksUseCase.execute({
      filters: { ...filters, resource: { userId } },
      relations: { flashcards: true }
    });
  }

  @Get('shared')
  @SerializeOptions({ type: FindDeckResponseDTO })
  @ApiOperation({ summary: 'Buscar decks compartilhados com o usuário' })
  @ApiOkResponse({ description: 'Decks retornados com sucesso', type: FindDeckResponseDTO })
  async findShared(@User('id') userId: number, @Query() filters: FindDeckQueryDTO): Promise<FindDeckResponseDTO> {
    return await this.findDecksUseCase.execute({
      filters: { ...filters, resource: { shares: { userId } } },
      relations: { flashcards: true }
    });
  }

  @Get(':deckId')
  @SerializeOptions({ type: DeckResponseDTO })
  @ApiOperation({ summary: 'Buscar um deck por ID' })
  @ApiOkResponse({ description: 'Deck encontrado', type: DeckResponseDTO })
  @ApiNotFoundResponse({ description: 'Deck não encontrado' })
  async findOne(@Param() params: FindOneDeckParamsDTO): Promise<DeckResponseDTO> {
    return await this.findOneDeckUseCase.execute({
      filters: { id: params.deckId },
      relations: { flashcards: true }
    });
  }

  @Patch(':deckId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'deckId')
  @SerializeOptions({ type: DeckResponseDTO })
  @ApiOperation({ summary: 'Atualizar um deck' })
  @ApiOkResponse({ description: 'Deck atualizado com sucesso', type: DeckResponseDTO })
  @ApiNotFoundResponse({ description: 'Deck não encontrado' })
  async update(@Param() params: UpdateDeckParamsDTO, @Body() data: UpdateDeckBodyDTO): Promise<DeckResponseDTO> {
    return await this.updateDeckUseCase.execute({ filters: { id: params.deckId }, data });
  }

  @Delete(':deckId')
  @ResourcePermission([], 'deckId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um deck' })
  @ApiNoContentResponse({ description: 'Deck deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Deck não encontrado' })
  async delete(@Param() params: DeleteDeckParamsDTO): Promise<void> {
    return await this.deleteDeckUseCase.execute({ filters: { id: params.deckId } });
  }
}
