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
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiForbiddenResponse
} from '@nestjs/swagger';

import { DeleteResourceShareLinkUseCase } from '@application/use-cases/resource-share-link/delete-resource-share-link.use-case';
import { FindOneResourceShareLinkUseCase } from '@application/use-cases/resource-share-link/find-one-resource-share-link.use-case';
import { GenerateResourceShareLinkUseCase } from '@application/use-cases/resource-share-link/generate-resource-share-link.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  DeleteResourceShareLinkParamsDTO,
  FindOneResourceShareLinkParamsDTO,
  GenerateResourceShareLinkBodyDTO,
  GenerateResourceShareLinkParamsDTO,
  ResourceShareLinkResponseDTO
} from '../../dtos/resource-share-link';

@Auth()
@ApiTags('Links de Compartilhamento de Recurso')
@Controller('resources/:resourceId/links')
@UseInterceptors(ClassSerializerInterceptor)
export class ResourceShareLinkController {
  constructor(
    private readonly generateResourceShareLinkUseCase: GenerateResourceShareLinkUseCase,
    private readonly findOneResourceShareLinkUseCase: FindOneResourceShareLinkUseCase,
    private readonly deleteResourceShareLinkUseCase: DeleteResourceShareLinkUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: ResourceShareLinkResponseDTO })
  @ApiOperation({ summary: 'Gerar ou atualizar link de compartilhamento de um recurso' })
  @ApiCreatedResponse({ description: 'Link gerado/atualizado com sucesso', type: ResourceShareLinkResponseDTO })
  @ApiNotFoundResponse({ description: 'Recurso não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o proprietário do recurso pode gerar links' })
  async generate(
    @User('id') userId: number,
    @Param() params: GenerateResourceShareLinkParamsDTO,
    @Body() body: GenerateResourceShareLinkBodyDTO
  ): Promise<ResourceShareLinkResponseDTO> {
    return await this.generateResourceShareLinkUseCase.execute({
      resourceId: params.resourceId,
      permission: body.permission,
      userId
    });
  }

  @Get()
  @SerializeOptions({ type: ResourceShareLinkResponseDTO })
  @ApiOperation({ summary: 'Buscar link de compartilhamento de um recurso' })
  @ApiOkResponse({ description: 'Link encontrado', type: ResourceShareLinkResponseDTO })
  @ApiNotFoundResponse({ description: 'Link de compartilhamento não encontrado' })
  async findOne(@Param() params: FindOneResourceShareLinkParamsDTO): Promise<ResourceShareLinkResponseDTO> {
    return await this.findOneResourceShareLinkUseCase.execute({ filters: { resourceId: params.resourceId } });
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar link de compartilhamento' })
  @ApiNoContentResponse({ description: 'Link deletado com sucesso' })
  @ApiNotFoundResponse({ description: 'Link de compartilhamento não encontrado' })
  @ApiForbiddenResponse({ description: 'Apenas o proprietário do recurso pode deletar links' })
  async delete(@User('id') userId: number, @Param() params: DeleteResourceShareLinkParamsDTO): Promise<void> {
    return await this.deleteResourceShareLinkUseCase.execute({ resourceId: params.resourceId, userId });
  }
}
