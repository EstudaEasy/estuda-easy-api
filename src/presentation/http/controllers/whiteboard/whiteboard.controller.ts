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

import { CreateWhiteboardUseCase } from '@application/use-cases/whiteboard/create-whiteboard.use-case';
import { DeleteWhiteboardUseCase } from '@application/use-cases/whiteboard/delete-whiteboard.use-case';
import { FindOneWhiteboardUseCase } from '@application/use-cases/whiteboard/find-one-whiteboard.use-case';
import { FindWhiteboardsUseCase } from '@application/use-cases/whiteboard/find-whiteboards.use-case';
import { UpdateWhiteboardUseCase } from '@application/use-cases/whiteboard/update-whiteboard.use-case';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateWhiteboardBodyDTO,
  FindOneWhiteboardParamsDTO,
  UpdateWhiteboardParamsDTO,
  DeleteWhiteboardParamsDTO,
  WhiteboardResponseDTO,
  FindWhiteboardQueryDTO,
  FindWhiteboardResponseDTO,
  UpdateWhiteboardBodyDTO
} from '../../dtos/whiteboard';

@Auth()
@ApiTags('Whiteboards')
@Controller('whiteboards')
@UseInterceptors(ClassSerializerInterceptor)
export class WhiteboardController {
  constructor(
    private readonly createWhiteboardUseCase: CreateWhiteboardUseCase,
    private readonly findOneWhiteboardUseCase: FindOneWhiteboardUseCase,
    private readonly findWhiteboardsUseCase: FindWhiteboardsUseCase,
    private readonly updateWhiteboardUseCase: UpdateWhiteboardUseCase,
    private readonly deleteWhiteboardUseCase: DeleteWhiteboardUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: WhiteboardResponseDTO })
  @ApiOperation({ summary: 'Criar um novo whiteboard' })
  @ApiCreatedResponse({ description: 'Whiteboard criado com sucesso', type: WhiteboardResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateWhiteboardBodyDTO): Promise<WhiteboardResponseDTO> {
    return await this.createWhiteboardUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindWhiteboardResponseDTO })
  @ApiOperation({ summary: 'Buscar whiteboards' })
  @ApiOkResponse({ description: 'Whiteboards retornados com sucesso', type: FindWhiteboardResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindWhiteboardQueryDTO): Promise<FindWhiteboardResponseDTO> {
    return await this.findWhiteboardsUseCase.execute({
      filters: { ...filters, resource: { userId } }
    });
  }

  @Get('shared')
  @SerializeOptions({ type: FindWhiteboardResponseDTO })
  @ApiOperation({ summary: 'Buscar whiteboards compartilhados com o usuário' })
  @ApiOkResponse({ description: 'Whiteboards retornados com sucesso', type: FindWhiteboardResponseDTO })
  async findShared(
    @User('id') userId: number,
    @Query() filters: FindWhiteboardQueryDTO
  ): Promise<FindWhiteboardResponseDTO> {
    return await this.findWhiteboardsUseCase.execute({
      filters: { ...filters, resource: { shares: { userId } } }
    });
  }

  @Get(':whiteboardId')
  @SerializeOptions({ type: WhiteboardResponseDTO })
  @ApiOperation({ summary: 'Buscar um whiteboard por ID' })
  @ApiOkResponse({ description: 'Whiteboard encontrado', type: WhiteboardResponseDTO })
  @ApiNotFoundResponse({ description: 'Whiteboard não encontrado' })
  async findOne(@Param() params: FindOneWhiteboardParamsDTO): Promise<WhiteboardResponseDTO> {
    return await this.findOneWhiteboardUseCase.execute({
      filters: { id: params.whiteboardId }
    });
  }

  @Patch(':whiteboardId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'whiteboardId')
  @SerializeOptions({ type: WhiteboardResponseDTO })
  @ApiOperation({ summary: 'Atualizar um whiteboard' })
  @ApiOkResponse({ description: 'Whiteboard atualizado com sucesso', type: WhiteboardResponseDTO })
  @ApiNotFoundResponse({ description: 'Whiteboard não encontrado' })
  async update(
    @Param() params: UpdateWhiteboardParamsDTO,
    @Body() data: UpdateWhiteboardBodyDTO
  ): Promise<WhiteboardResponseDTO> {
    return await this.updateWhiteboardUseCase.execute({ filters: { id: params.whiteboardId }, data });
  }

  @Delete(':whiteboardId')
  @ResourcePermission([], 'whiteboardId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um whiteboard' })
  @ApiNoContentResponse({ description: 'Whiteboard deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Whiteboard não encontrado' })
  async delete(@Param() params: DeleteWhiteboardParamsDTO): Promise<void> {
    return await this.deleteWhiteboardUseCase.execute({ filters: { id: params.whiteboardId } });
  }
}
