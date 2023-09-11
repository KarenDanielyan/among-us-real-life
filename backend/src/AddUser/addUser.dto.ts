// user.dto.ts

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsNumber()
  readonly 'ID_42': number;

  @IsNotEmpty()
  @IsString()
  readonly displayName: string;

  @IsOptional()
  @IsString()
  readonly avatarUrl?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsBoolean()
  readonly isTwoFactorEnabled: boolean;

  @IsOptional()
  @IsNumber()
  readonly wins?: number;

  @IsOptional()
  @IsNumber()
  readonly losses?: number;
}
