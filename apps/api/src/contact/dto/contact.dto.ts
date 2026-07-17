import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'juan@email.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+1 234 567 890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'Me gustaría información sobre sus servicios.' })
  @IsString()
  message: string;
}
