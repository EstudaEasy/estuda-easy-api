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
  ApiConflictResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { CreateGroupUseCase } from '@application/use-cases/group/create-group.use-case';
import { DeleteGroupUseCase } from '@application/use-cases/group/delete-group.use-case';
import { FindGroupsUseCase } from '@application/use-cases/group/find-groups.use-case';
import { FindOneGroupUseCase } from '@application/use-cases/group/find-one-group.use-case';
import { JoinGroupUseCase } from '@application/use-cases/group/join-group.use-case';
import { ResetGroupInviteCodeUseCase } from '@application/use-cases/group/reset-group-invite-code.use-case';
import { UpdateGroupUseCase } from '@application/use-cases/group/update-group.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateGroupBodyDTO,
  DeleteGroupParamsDTO,
  FindGroupQueryDTO,
  FindGroupResponseDTO,
  FindOneGroupParamsDTO,
  GroupResponseDTO,
  JoinGroupBodyDTO,
  ResetGroupInviteCodeParamsDTO,
  UpdateGroupBodyDTO,
  UpdateGroupParamsDTO
} from '../../dtos/group';
import { GroupMemberResponseDTO } from '../../dtos/group-member';

@Auth()
@ApiTags('Grupos')
@Controller('groups')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupController {
  constructor(
    private readonly createGroupUseCase: CreateGroupUseCase,
    private readonly findGroupsUseCase: FindGroupsUseCase,
    private readonly findOneGroupUseCase: FindOneGroupUseCase,
    private readonly updateGroupUseCase: UpdateGroupUseCase,
    private readonly deleteGroupUseCase: DeleteGroupUseCase,
    private readonly resetGroupInviteCodeUseCase: ResetGroupInviteCodeUseCase,
    private readonly joinGroupUseCase: JoinGroupUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: GroupResponseDTO })
  @ApiOperation({ summary: 'Criar um novo grupo' })
  @ApiCreatedResponse({ description: 'Grupo criado com sucesso', type: GroupResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateGroupBodyDTO): Promise<GroupResponseDTO> {
    return await this.createGroupUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindGroupResponseDTO })
  @ApiOperation({ summary: 'Buscar grupos do usuário' })
  @ApiOkResponse({ description: 'Grupos retornados com sucesso', type: FindGroupResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindGroupQueryDTO): Promise<FindGroupResponseDTO> {
    return await this.findGroupsUseCase.execute({ filters: { ...filters, members: { userId } } });
  }

  @Get(':groupId')
  @SerializeOptions({ type: GroupResponseDTO })
  @ApiOperation({ summary: 'Buscar um grupo por ID' })
  @ApiOkResponse({ description: 'Grupo encontrado', type: GroupResponseDTO })
  @ApiNotFoundResponse({ description: 'Grupo não encontrado' })
  async findOne(@Param() params: FindOneGroupParamsDTO): Promise<GroupResponseDTO> {
    return await this.findOneGroupUseCase.execute({ filters: { id: params.groupId } });
  }

  @Patch(':groupId')
  @SerializeOptions({ type: GroupResponseDTO })
  @ApiOperation({ summary: 'Atualizar um grupo' })
  @ApiOkResponse({ description: 'Grupo atualizado com sucesso', type: GroupResponseDTO })
  @ApiNotFoundResponse({ description: 'Grupo não encontrado' })
  @ApiForbiddenResponse({ description: 'Membro comum não tem permissão para atualizar o grupo' })
  async update(
    @User('id') userId: number,
    @Param() params: UpdateGroupParamsDTO,
    @Body() data: UpdateGroupBodyDTO
  ): Promise<GroupResponseDTO> {
    return await this.updateGroupUseCase.execute({ filters: { id: params.groupId }, data, userId });
  }

  @Patch(':groupId/invite-code')
  @SerializeOptions({ type: GroupResponseDTO })
  @ApiOperation({ summary: 'Resetar o código de convite do grupo' })
  @ApiOkResponse({ description: 'Código de convite resetado com sucesso', type: GroupResponseDTO })
  @ApiNotFoundResponse({ description: 'Grupo não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o dono do grupo pode resetar o código de convite' })
  async resetInviteCode(
    @User('id') userId: number,
    @Param() params: ResetGroupInviteCodeParamsDTO
  ): Promise<GroupResponseDTO> {
    return await this.resetGroupInviteCodeUseCase.execute({ filters: { id: params.groupId }, userId });
  }

  @Post('join')
  @SerializeOptions({ type: GroupMemberResponseDTO })
  @ApiOperation({ summary: 'Entrar em um grupo através do código de convite' })
  @ApiCreatedResponse({ description: 'Entrou no grupo com sucesso', type: GroupMemberResponseDTO })
  @ApiNotFoundResponse({ description: 'Código de convite inválido' })
  @ApiConflictResponse({ description: 'Usuário já é membro do grupo' })
  async join(@User('id') userId: number, @Body() data: JoinGroupBodyDTO): Promise<GroupMemberResponseDTO> {
    return await this.joinGroupUseCase.execute({ inviteCode: data.inviteCode, userId });
  }

  @Delete(':groupId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um grupo' })
  @ApiNoContentResponse({ description: 'Grupo deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Grupo não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o dono do grupo pode deletar o grupo' })
  async delete(@User('id') userId: number, @Param() params: DeleteGroupParamsDTO): Promise<void> {
    return await this.deleteGroupUseCase.execute({ filters: { id: params.groupId }, userId });
  }
}
