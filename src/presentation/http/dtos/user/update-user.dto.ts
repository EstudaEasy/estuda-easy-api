import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsInt, IsPositive, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserBodyDTO } from './create-user.dto';

export class UpdateUserParamsDTO {
  @ApiProperty({ description: 'ID do usuário', example: 1 })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  userId: number;
}

export class UpdateUserBodyDTO extends OmitType(PartialType(CreateUserBodyDTO), ['email']) {}
