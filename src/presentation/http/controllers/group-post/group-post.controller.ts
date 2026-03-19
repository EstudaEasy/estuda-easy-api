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
  ApiNoContentResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { CreateGroupPostUseCase } from '@application/use-cases/group-post/create-group-post.use-case';
import { DeleteGroupPostUseCase } from '@application/use-cases/group-post/delete-group-post.use-case';
import { FindGroupPostsUseCase } from '@application/use-cases/group-post/find-group-posts.use-case';
import { FindOneGroupPostUseCase } from '@application/use-cases/group-post/find-one-group-post.use-case';
import { UpdateGroupPostUseCase } from '@application/use-cases/group-post/update-group-post.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateGroupPostBodyDTO,
  CreateGroupPostParamsDTO,
  DeleteGroupPostParamsDTO,
  FindGroupPostsParamsDTO,
  FindGroupPostsQueryDTO,
  FindGroupPostsResponseDTO,
  FindOneGroupPostParamsDTO,
  GroupPostResponseDTO,
  UpdateGroupPostBodyDTO,
  UpdateGroupPostParamsDTO
} from '../../dtos/group-post';

@Auth()
@ApiTags('Posts de Grupo')
@Controller('groups/:groupId/posts')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupPostController {
  constructor(
    private readonly createGroupPostUseCase: CreateGroupPostUseCase,
    private readonly findGroupPostsUseCase: FindGroupPostsUseCase,
    private readonly findOneGroupPostUseCase: FindOneGroupPostUseCase,
    private readonly updateGroupPostUseCase: UpdateGroupPostUseCase,
    private readonly deleteGroupPostUseCase: DeleteGroupPostUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: GroupPostResponseDTO })
  @ApiOperation({
    summary: 'Criar um novo post no grupo',
    description: 'Regra de negócio: o usuário-autor do post deve pertencer ao grupo.'
  })
  @ApiCreatedResponse({ description: 'Post criado com sucesso', type: GroupPostResponseDTO })
  @ApiNotFoundResponse({ description: 'Membro do grupo não encontrado' })
  async create(
    @User('id') userId: number,
    @Param() params: CreateGroupPostParamsDTO,
    @Body() body: CreateGroupPostBodyDTO
  ): Promise<GroupPostResponseDTO> {
    return await this.createGroupPostUseCase.execute({
      data: { content: body.content, groupId: params.groupId },
      userId
    });
  }

  @Get()
  @SerializeOptions({ type: FindGroupPostsResponseDTO })
  @ApiOperation({ summary: 'Buscar posts de um grupo' })
  @ApiOkResponse({ description: 'Posts retornados com sucesso', type: FindGroupPostsResponseDTO })
  async find(
    @Param() params: FindGroupPostsParamsDTO,
    @Query() query: FindGroupPostsQueryDTO
  ): Promise<FindGroupPostsResponseDTO> {
    return await this.findGroupPostsUseCase.execute({
      filters: { groupId: params.groupId, ...query },
      relations: { author: true }
    });
  }

  @Get(':postId')
  @SerializeOptions({ type: GroupPostResponseDTO })
  @ApiOperation({ summary: 'Buscar um post do grupo por ID' })
  @ApiOkResponse({ description: 'Post encontrado', type: GroupPostResponseDTO })
  @ApiNotFoundResponse({ description: 'Post do grupo não encontrado' })
  async findOne(@Param() params: FindOneGroupPostParamsDTO): Promise<GroupPostResponseDTO> {
    return await this.findOneGroupPostUseCase.execute({
      filters: { id: params.postId, groupId: params.groupId },
      relations: { author: true }
    });
  }

  @Patch(':postId')
  @SerializeOptions({ type: GroupPostResponseDTO })
  @ApiOperation({
    summary: 'Atualizar um post do grupo',
    description: 'Apenas o autor do post pode editar.'
  })
  @ApiOkResponse({ description: 'Post atualizado com sucesso', type: GroupPostResponseDTO })
  @ApiNotFoundResponse({ description: 'Post do grupo não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o autor do post pode editar' })
  async update(
    @User('id') userId: number,
    @Param() params: UpdateGroupPostParamsDTO,
    @Body() body: UpdateGroupPostBodyDTO
  ): Promise<GroupPostResponseDTO> {
    return await this.updateGroupPostUseCase.execute({
      filters: { id: params.postId, groupId: params.groupId },
      data: body,
      userId
    });
  }

  @Delete(':postId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Deletar um post do grupo',
    description: 'O post pode ser deletado pelo autor do post, pelo dono do grupo ou por um admin do grupo.'
  })
  @ApiNoContentResponse({ description: 'Post deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Post do grupo não encontrado' })
  @ApiForbiddenResponse({ description: 'Somente autor, dono ou admin do grupo podem deletar' })
  async delete(@User('id') userId: number, @Param() params: DeleteGroupPostParamsDTO): Promise<void> {
    return await this.deleteGroupPostUseCase.execute({
      filters: { id: params.postId, groupId: params.groupId },
      userId
    });
  }
}
