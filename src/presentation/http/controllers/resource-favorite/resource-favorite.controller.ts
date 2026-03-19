import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiConflictResponse
} from '@nestjs/swagger';

import { CreateResourceFavoriteUseCase } from '@application/use-cases/resource-favorite/create-resource-favorite.use-case';
import { DeleteResourceFavoriteUseCase } from '@application/use-cases/resource-favorite/delete-resource-favorite.use-case';
import { FindOneResourceFavoriteUseCase } from '@application/use-cases/resource-favorite/find-one-resource-favorite.use-case';
import { FindResourceFavoritesUseCase } from '@application/use-cases/resource-favorite/find-resource-favorites.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateResourceFavoriteBodyDTO,
  DeleteResourceFavoriteParamsDTO,
  FindOneResourceFavoriteParamsDTO,
  FindResourceFavoriteResponseDTO,
  ResourceFavoriteResponseDTO
} from '../../dtos/resource-favorite';

@Auth()
@ApiTags('Recursos Favoritos')
@Controller('resources/favorites')
@UseInterceptors(ClassSerializerInterceptor)
export class ResourceFavoriteController {
  constructor(
    private readonly createResourceFavoriteUseCase: CreateResourceFavoriteUseCase,
    private readonly findResourceFavoritesUseCase: FindResourceFavoritesUseCase,
    private readonly findOneResourceFavoriteUseCase: FindOneResourceFavoriteUseCase,
    private readonly deleteResourceFavoriteUseCase: DeleteResourceFavoriteUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: ResourceFavoriteResponseDTO })
  @ApiOperation({ summary: 'Favoritar um recurso para o usuário autenticado' })
  @ApiCreatedResponse({ description: 'Recurso favoritado com sucesso', type: ResourceFavoriteResponseDTO })
  @ApiNotFoundResponse({ description: 'Recurso não encontrado' })
  @ApiConflictResponse({ description: 'Recurso já está favoritado para o usuário' })
  async create(
    @User('id') userId: number,
    @Body() body: CreateResourceFavoriteBodyDTO
  ): Promise<ResourceFavoriteResponseDTO> {
    return await this.createResourceFavoriteUseCase.execute({ userId, resourceId: body.resourceId });
  }

  @Get()
  @SerializeOptions({ type: FindResourceFavoriteResponseDTO })
  @ApiOperation({ summary: 'Buscar recursos favoritos do usuário autenticado' })
  @ApiOkResponse({ description: 'Recursos favoritos retornados com sucesso', type: FindResourceFavoriteResponseDTO })
  async find(@User('id') userId: number): Promise<FindResourceFavoriteResponseDTO> {
    return await this.findResourceFavoritesUseCase.execute({ filters: { userId } });
  }

  @Get(':favoriteId')
  @SerializeOptions({ type: ResourceFavoriteResponseDTO })
  @ApiOperation({ summary: 'Buscar um recurso favorito por ID' })
  @ApiOkResponse({ description: 'Recurso favorito encontrado', type: ResourceFavoriteResponseDTO })
  @ApiNotFoundResponse({ description: 'Recurso favorito não encontrado' })
  async findOne(
    @User('id') userId: number,
    @Param() params: FindOneResourceFavoriteParamsDTO
  ): Promise<ResourceFavoriteResponseDTO> {
    return await this.findOneResourceFavoriteUseCase.execute({ filters: { id: params.favoriteId, userId } });
  }

  @Delete(':favoriteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um recurso dos favoritos do usuário autenticado' })
  @ApiNoContentResponse({ description: 'Recurso favorito removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Recurso favorito não encontrado' })
  @ApiForbiddenResponse({ description: 'Sem permissão para remover este favorito' })
  async delete(@User('id') userId: number, @Param() params: DeleteResourceFavoriteParamsDTO): Promise<void> {
    return await this.deleteResourceFavoriteUseCase.execute({ favoriteId: params.favoriteId, userId });
  }
}
