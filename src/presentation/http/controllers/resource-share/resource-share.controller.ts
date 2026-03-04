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
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { CreateResourceShareFromLinkUseCase } from '@application/use-cases/resource-share/create-resource-share-from-link.use-case';
import { DeleteResourceShareUseCase } from '@application/use-cases/resource-share/delete-resource-share.use-case';
import { FindResourceSharesUseCase } from '@application/use-cases/resource-share/find-resource-shares.use-case';
import { UpdateResourceShareUseCase } from '@application/use-cases/resource-share/update-resource-share.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateResourceShareFromLinkParamsDTO,
  DeleteResourceShareParamsDTO,
  FindResourceSharesParamsDTO,
  FindResourceSharesResponseDTO,
  ResourceShareResponseDTO,
  UpdateResourceShareBodyDTO,
  UpdateResourceShareParamsDTO
} from '../../dtos/resource-share';

@Auth()
@ApiTags('Compartilhamentos de Recurso')
@Controller('resources/:resourceId/shares')
@UseInterceptors(ClassSerializerInterceptor)
export class ResourceShareController {
  constructor(
    private readonly createResourceShareFromLinkUseCase: CreateResourceShareFromLinkUseCase,
    private readonly findResourceSharesUseCase: FindResourceSharesUseCase,
    private readonly updateResourceShareUseCase: UpdateResourceShareUseCase,
    private readonly deleteResourceShareUseCase: DeleteResourceShareUseCase
  ) {}

  @Post('from-link/:linkId')
  @SerializeOptions({ type: ResourceShareResponseDTO })
  @ApiOperation({ summary: 'Gerar ou atualizar compartilhamento de recurso a partir de um link' })
  @ApiCreatedResponse({ description: 'Compartilhamento criado/atualizado com sucesso', type: ResourceShareResponseDTO })
  @ApiNotFoundResponse({ description: 'Link de compartilhamento não encontrado' })
  async createFromLink(
    @User('id') userId: number,
    @Param() params: CreateResourceShareFromLinkParamsDTO
  ): Promise<ResourceShareResponseDTO> {
    return await this.createResourceShareFromLinkUseCase.execute({ linkId: params.linkId, userId });
  }

  @Get()
  @SerializeOptions({ type: FindResourceSharesResponseDTO })
  @ApiOperation({ summary: 'Listar compartilhamentos de um recurso' })
  @ApiOkResponse({ description: 'Compartilhamentos retornados com sucesso', type: FindResourceSharesResponseDTO })
  async find(@Param() params: FindResourceSharesParamsDTO): Promise<FindResourceSharesResponseDTO> {
    return await this.findResourceSharesUseCase.execute({
      filters: { resourceId: params.resourceId },
      relations: { user: true }
    });
  }

  @Patch(':shareId')
  @SerializeOptions({ type: ResourceShareResponseDTO })
  @ApiOperation({ summary: 'Atualizar permissão de um compartilhamento' })
  @ApiOkResponse({ description: 'Permissão atualizada com sucesso', type: ResourceShareResponseDTO })
  @ApiNotFoundResponse({ description: 'Compartilhamento não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o proprietário do recurso pode alterar permissões' })
  async update(
    @User('id') userId: number,
    @Param() params: UpdateResourceShareParamsDTO,
    @Body() body: UpdateResourceShareBodyDTO
  ): Promise<ResourceShareResponseDTO> {
    return await this.updateResourceShareUseCase.execute({
      userId,
      shareId: params.shareId,
      permission: body.permission
    });
  }

  @Delete(':shareId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um compartilhamento de recurso' })
  @ApiNoContentResponse({ description: 'Compartilhamento removido com sucesso' })
  @ApiNotFoundResponse({ description: 'Compartilhamento não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o proprietário do recurso pode remover compartilhamentos' })
  async delete(@User('id') userId: number, @Param() params: DeleteResourceShareParamsDTO): Promise<void> {
    return await this.deleteResourceShareUseCase.execute({ shareId: params.shareId, userId });
  }
}
