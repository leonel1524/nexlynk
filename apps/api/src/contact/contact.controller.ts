import { Controller, Post, Get, Patch, Body, Param, UseGuards, Request, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { apiResponse, apiMessage } from '../common/dto/api-response';
import { Request as ExpressRequest } from 'express';

@ApiTags('contact')
@Controller('businesses')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post(':businessId/contact')
  @ApiOperation({ summary: 'Enviar mensaje de contacto' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado correctamente' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async create(
    @Param('businessId') businessId: string,
    @Body() dto: CreateContactMessageDto,
    @Req() req: ExpressRequest,
  ) {
    const ip = req.ip || req.headers['x-forwarded-for'] as string;
    const userAgent = req.headers['user-agent'];
    const data = await this.contactService.create(businessId, dto, ip, userAgent);
    return apiResponse(data);
  }

  @Get(':businessId/contact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mensajes de contacto de un negocio' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes' })
  async findAll(@Param('businessId') businessId: string, @Request() req: any) {
    const data = await this.contactService.findByBusiness(businessId, req.user.id);
    return apiResponse(data, data.length);
  }

  @Patch(':businessId/contact/:id/read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar mensaje como leído' })
  @ApiResponse({ status: 200, description: 'Mensaje marcado como leído' })
  async markAsRead(
    @Param('businessId') businessId: string,
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const data = await this.contactService.markAsRead(id, businessId, req.user.id);
    return apiResponse(data);
  }
}
