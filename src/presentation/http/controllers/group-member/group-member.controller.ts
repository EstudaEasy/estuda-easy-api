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
  Query,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { ChangeMemberRoleUseCase } from '@application/use-cases/group-member/change-member-role.use-case';
import { FindGroupMembersUseCase } from '@application/use-cases/group-member/find-group-members.use-case';
import { FindOneGroupMemberUseCase } from '@application/use-cases/group-member/find-one-group-member.use-case';
import { RemoveGroupMemberUseCase } from '@application/use-cases/group-member/remove-group-member.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  ChangeMemberRoleBodyDTO,
  ChangeMemberRoleParamsDTO,
  FindGroupMembersParamsDTO,
  FindGroupMembersQueryDTO,
  FindGroupMembersResponseDTO,
  FindOneGroupMemberParamsDTO,
  GroupMemberResponseDTO,
  RemoveGroupMemberParamsDTO
} from '../../dtos/group-member';

@Auth()
@ApiTags('Membros de Grupo')
@Controller('groups/:groupId/members')
@UseInterceptors(ClassSerializerInterceptor)
export class GroupMemberController {
  constructor(
    private readonly findGroupMembersUseCase: FindGroupMembersUseCase,
    private readonly findOneGroupMemberUseCase: FindOneGroupMemberUseCase,
    private readonly changeMemberRoleUseCase: ChangeMemberRoleUseCase,
    private readonly removeGroupMemberUseCase: RemoveGroupMemberUseCase
  ) {}

  @Get()
  @SerializeOptions({ type: FindGroupMembersResponseDTO })
  @ApiOperation({ summary: 'Buscar membros de um grupo' })
  @ApiOkResponse({ description: 'Membros retornados com sucesso', type: FindGroupMembersResponseDTO })
  async find(
    @Param() params: FindGroupMembersParamsDTO,
    @Query() query: FindGroupMembersQueryDTO
  ): Promise<FindGroupMembersResponseDTO> {
    return await this.findGroupMembersUseCase.execute({
      filters: { groupId: params.groupId, ...query },
      relations: { user: true }
    });
  }

  @Get(':memberId')
  @SerializeOptions({ type: GroupMemberResponseDTO })
  @ApiOperation({ summary: 'Buscar um membro do grupo' })
  @ApiOkResponse({ description: 'Membro encontrado', type: GroupMemberResponseDTO })
  @ApiNotFoundResponse({ description: 'Membro não encontrado' })
  async findOne(@Param() params: FindOneGroupMemberParamsDTO): Promise<GroupMemberResponseDTO> {
    return await this.findOneGroupMemberUseCase.execute({
      filters: { id: params.memberId, groupId: params.groupId },
      relations: { user: true }
    });
  }

  @Patch(':memberId/role')
  @SerializeOptions({ type: GroupMemberResponseDTO })
  @ApiOperation({ summary: 'Alterar o role de um membro do grupo' })
  @ApiOkResponse({ description: 'Role alterado com sucesso', type: GroupMemberResponseDTO })
  @ApiNotFoundResponse({ description: 'Membro não encontrado' })
  @ApiForbiddenResponse({ description: 'Permissão negada para alterar role' })
  async changeRole(
    @User('id') requesterId: number,
    @Param() params: ChangeMemberRoleParamsDTO,
    @Body() body: ChangeMemberRoleBodyDTO
  ): Promise<GroupMemberResponseDTO> {
    return await this.changeMemberRoleUseCase.execute({
      groupId: params.groupId,
      memberId: params.memberId,
      requesterId,
      role: body.role
    });
  }

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um membro do grupo' })
  @ApiNoContentResponse({ description: 'Membro removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Membro não encontrado' })
  @ApiForbiddenResponse({ description: 'Permissão negada para remover membro' })
  async remove(@User('id') requesterId: number, @Param() params: RemoveGroupMemberParamsDTO): Promise<void> {
    return await this.removeGroupMemberUseCase.execute({
      groupId: params.groupId,
      memberId: params.memberId,
      requesterId
    });
  }
}
