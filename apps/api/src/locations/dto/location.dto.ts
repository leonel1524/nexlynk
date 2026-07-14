import { IsString, IsOptional, IsBoolean, IsNumber, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty({ example: 'Sede Principal' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Av. Principal, Caracas' })
  @IsString()
  address: string;

  @ApiPropertyOptional({ example: 10.4806 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: -66.9036 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional({ example: { 'Lun-Vie': '8am-6pm', 'Sáb': '9am-2pm' } })
  @IsObject()
  @IsOptional()
  schedule?: Record<string, string>;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}

export class UpdateLocationDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  schedule?: Record<string, string>;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_main?: boolean;
}
