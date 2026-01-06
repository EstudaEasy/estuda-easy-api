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
  ApiConflictResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';

import { CreateUserUseCase } from '@application/use-cases/user/create-user.use-case';
import { DeleteUserUseCase } from '@application/use-cases/user/delete-user.use-case';
import { FindOneUserUseCase } from '@application/use-cases/user/find-one-user.use-case';
import { FindUsersUseCase } from '@application/use-cases/user/find-users.use-case';
import { UpdateUserUseCase } from '@application/use-cases/user/update-user.use-case';

import {
  CreateUserBodyDTO,
  FindOneUserParamsDTO,
  UpdateUserParamsDTO,
  DeleteUserParamsDTO,
  UserResponseDTO,
  FindUserQueryDTO,
  FindUserResponseDTO,
  UpdateUserBodyDTO
} from '../../dtos/user';

@ApiTags('Usuários')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findOneUserUseCase: FindOneUserUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: UserResponseDTO })
  @ApiOperation({ summary: 'Criar um novo usuário' })
  @ApiCreatedResponse({ description: 'Usuário criado com sucesso', type: UserResponseDTO })
  @ApiConflictResponse({ description: 'Email já está em uso' })
  async create(@Body() data: CreateUserBodyDTO): Promise<UserResponseDTO> {
    return await this.createUserUseCase.execute({ data });
  }

  @Get()
  @SerializeOptions({ type: FindUserResponseDTO })
  @ApiOperation({ summary: 'Buscar usuários' })
  @ApiOkResponse({ description: 'Usuários retornados com sucesso', type: FindUserResponseDTO })
  async find(@Query() filters: FindUserQueryDTO): Promise<FindUserResponseDTO> {
    return await this.findUsersUseCase.execute({ filters });
  }

  @Get(':userId')
  @SerializeOptions({ type: UserResponseDTO })
  @ApiOperation({ summary: 'Buscar um usuário por ID' })
  @ApiOkResponse({ description: 'Usuário encontrado', type: UserResponseDTO })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async findOne(@Param() params: FindOneUserParamsDTO): Promise<UserResponseDTO> {
    return await this.findOneUserUseCase.execute({ filters: { id: params.userId } });
  }

  @Patch(':userId')
  @SerializeOptions({ type: UserResponseDTO })
  @ApiOperation({ summary: 'Atualizar um usuário' })
  @ApiOkResponse({ description: 'Usuário atualizado com sucesso', type: UserResponseDTO })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async update(@Param() params: UpdateUserParamsDTO, @Body() data: UpdateUserBodyDTO): Promise<UserResponseDTO> {
    return await this.updateUserUseCase.execute({ filters: { id: params.userId }, data });
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um usuário' })
  @ApiNoContentResponse({ description: 'Usuário deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Usuário não encontrado' })
  async delete(@Param() params: DeleteUserParamsDTO): Promise<void> {
    return await this.deleteUserUseCase.execute({ filters: { id: params.userId } });
  }
}
