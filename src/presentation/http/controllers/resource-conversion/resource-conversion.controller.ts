import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';

import { ConvertResourceUseCase } from '@application/use-cases/resource-conversion/convert-resource.use-case';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import { ConvertResourceBodyDTO, ConvertResourceResponseDTO } from '../../dtos/resource-conversion';

@Auth()
@ApiTags('Conversão de Recursos')
@Controller('resources/:resourceId')
@UseInterceptors(ClassSerializerInterceptor)
export class ResourceConversionController {
  constructor(private readonly convertResourceUseCase: ConvertResourceUseCase) {}

  @Post('convert')
  @HttpCode(HttpStatus.OK)
  @SerializeOptions({ type: ConvertResourceResponseDTO })
  @ApiOperation({
    summary: `Converter um recurso existente em outro tipo de recurso (quiz, deck ou task)`,
    description: `Usa IA para converter um recurso existente (diário, quiz ou deck) em outro tipo (quiz, deck ou task). 
      Os tipos suportados são: diary→quiz, diary→deck, diary→task, quiz→deck, quiz→task, deck→quiz, deck→task.
      O recurso gerado não é salvo automaticamente. Para isso, utilize o endpoint de criação 
      correspondente ao tipo do recurso gerado.`
  })
  @ApiCreatedResponse({ description: 'Recurso convertido com sucesso', type: ConvertResourceResponseDTO })
  @ApiUnprocessableEntityResponse({ description: 'Conversão entre os tipos informados não é suportada' })
  async convert(@User('id') userId: number, @Body() body: ConvertResourceBodyDTO): Promise<ConvertResourceResponseDTO> {
    return this.convertResourceUseCase.execute({
      sourceResourceId: body.sourceResourceId,
      targetResourceType: body.targetResourceType,
      userId
    });
  }
}
