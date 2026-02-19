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

import { CreateDiaryUseCase } from '@application/use-cases/diary/create-diary.use-case';
import { DeleteDiaryUseCase } from '@application/use-cases/diary/delete-diary.use-case';
import { FindDiariesUseCase } from '@application/use-cases/diary/find-diaries.use-case';
import { FindOneDiaryUseCase } from '@application/use-cases/diary/find-one-diary.use-case';
import { UpdateDiaryUseCase } from '@application/use-cases/diary/update-diary.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateDiaryBodyDTO,
  FindOneDiaryParamsDTO,
  UpdateDiaryParamsDTO,
  DeleteDiaryParamsDTO,
  DiaryResponseDTO,
  FindDiaryQueryDTO,
  FindDiaryResponseDTO,
  UpdateDiaryBodyDTO
} from '../../dtos/diary';

@Auth()
@ApiTags('Diários')
@Controller('diaries')
@UseInterceptors(ClassSerializerInterceptor)
export class DiaryController {
  constructor(
    private readonly createDiaryUseCase: CreateDiaryUseCase,
    private readonly findOneDiaryUseCase: FindOneDiaryUseCase,
    private readonly findDiariesUseCase: FindDiariesUseCase,
    private readonly updateDiaryUseCase: UpdateDiaryUseCase,
    private readonly deleteDiaryUseCase: DeleteDiaryUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: DiaryResponseDTO })
  @ApiOperation({ summary: 'Criar um novo diário' })
  @ApiCreatedResponse({ description: 'Diário criado com sucesso', type: DiaryResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateDiaryBodyDTO): Promise<DiaryResponseDTO> {
    return await this.createDiaryUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindDiaryResponseDTO })
  @ApiOperation({ summary: 'Buscar diários' })
  @ApiOkResponse({ description: 'Diários retornados com sucesso', type: FindDiaryResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindDiaryQueryDTO): Promise<FindDiaryResponseDTO> {
    return await this.findDiariesUseCase.execute({
      filters: { ...filters, resource: { userId } },
      relations: { resource: true }
    });
  }

  @Get('shared')
  @SerializeOptions({ type: FindDiaryResponseDTO })
  @ApiOperation({ summary: 'Buscar diários compartilhados com o usuário' })
  @ApiOkResponse({ description: 'Diários retornados com sucesso', type: FindDiaryResponseDTO })
  async findShared(@User('id') userId: number, @Query() filters: FindDiaryQueryDTO): Promise<FindDiaryResponseDTO> {
    return await this.findDiariesUseCase.execute({
      filters: { ...filters, resource: { shares: { userId } } },
      relations: { resource: true }
    });
  }

  @Get(':diaryId')
  @SerializeOptions({ type: DiaryResponseDTO })
  @ApiOperation({ summary: 'Buscar um diário por ID' })
  @ApiOkResponse({ description: 'Diário encontrado', type: DiaryResponseDTO })
  @ApiNotFoundResponse({ description: 'Diário não encontrado' })
  async findOne(@Param() params: FindOneDiaryParamsDTO): Promise<DiaryResponseDTO> {
    return await this.findOneDiaryUseCase.execute({
      filters: { id: params.diaryId },
      relations: { resource: true }
    });
  }

  @Patch(':diaryId')
  @ResourcePermission({ param: 'diaryId', type: 'diary', permissions: ['edit', 'admin'] })
  @SerializeOptions({ type: DiaryResponseDTO })
  @ApiOperation({ summary: 'Atualizar um diário' })
  @ApiOkResponse({ description: 'Diário atualizado com sucesso', type: DiaryResponseDTO })
  @ApiNotFoundResponse({ description: 'Diário não encontrado' })
  async update(@Param() params: UpdateDiaryParamsDTO, @Body() data: UpdateDiaryBodyDTO): Promise<DiaryResponseDTO> {
    return await this.updateDiaryUseCase.execute({ filters: { id: params.diaryId }, data });
  }

  @Delete(':diaryId')
  @ResourcePermission({ param: 'diaryId', type: 'diary' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar um diário' })
  @ApiNoContentResponse({ description: 'Diário deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Diário não encontrado' })
  async delete(@Param() params: DeleteDiaryParamsDTO): Promise<void> {
    return await this.deleteDiaryUseCase.execute({ filters: { id: params.diaryId } });
  }
}
