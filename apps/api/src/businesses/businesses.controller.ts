import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { apiResponse, apiMessage } from '../common/dto/api-response';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener todos los negocios del usuario' })
  @ApiResponse({ status: 200, description: 'Lista de negocios' })
  async findAll(@Request() req: any) {
    const data = await this.businessesService.findAll(req.user.id);
    return apiResponse(data, data.length);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Obtener negocio público por slug' })
  @ApiResponse({ status: 200, description: 'Negocio con menús y ubicaciones' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    const data = await this.businessesService.findBySlug(slug);
    return apiResponse(data);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un negocio por ID' })
  @ApiResponse({ status: 200, description: 'Negocio encontrado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const data = await this.businessesService.findOne(id, req.user.id);
    return apiResponse(data);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo negocio' })
  @ApiResponse({ status: 201, description: 'Negocio creado' })
  async create(@Body() createBusinessDto: CreateBusinessDto, @Request() req: any) {
    const data = await this.businessesService.create(req.user.id, createBusinessDto);
    return apiResponse(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un negocio' })
  @ApiResponse({ status: 200, description: 'Negocio actualizado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @Request() req: any,
  ) {
    const data = await this.businessesService.update(id, req.user.id, updateBusinessDto);
    return apiResponse(data);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un negocio' })
  @ApiResponse({ status: 200, description: 'Negocio eliminado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.businessesService.remove(id, req.user.id);
    return apiMessage('Negocio eliminado correctamente');
  }
}
