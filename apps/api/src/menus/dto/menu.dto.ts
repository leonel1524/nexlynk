import { IsString, IsOptional, IsBoolean, IsNumber, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'Empanadas' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Empanadas de carne' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 3.5 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_url?: string;
}

export class CreateMenuCategoryDto {
  @ApiProperty({ example: 'Entradas' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [CreateMenuItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  @IsOptional()
  items?: CreateMenuItemDto[];
}

export class CreateMenuDto {
  @ApiProperty({ example: 'Menú Principal' })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: [CreateMenuCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuCategoryDto)
  @IsOptional()
  categories?: CreateMenuCategoryDto[];
}

export class UpdateMenuDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sort_order?: number;

  @ApiPropertyOptional({ type: [CreateMenuCategoryDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuCategoryDto)
  @IsOptional()
  categories?: CreateMenuCategoryDto[];
}

export class UpdateMenuItemDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image_url?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  is_available?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  sort_order?: number;
}
