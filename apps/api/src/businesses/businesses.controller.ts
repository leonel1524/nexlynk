import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

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
    return this.businessesService.findAll(req.user.id);
  }

  @Get('public/:slug')
  @ApiOperation({ summary: 'Obtener negocio público por slug' })
  @ApiResponse({ status: 200, description: 'Negocio con menús y ubicaciones' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async findBySlug(@Param('slug') slug: string) {
    return this.businessesService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un negocio por ID' })
  @ApiResponse({ status: 200, description: 'Negocio encontrado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    return this.businessesService.findOne(id, req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo negocio' })
  @ApiResponse({ status: 201, description: 'Negocio creado' })
  async create(@Body() createBusinessDto: CreateBusinessDto, @Request() req: any) {
    return this.businessesService.create(req.user.id, createBusinessDto);
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
    return this.businessesService.update(id, req.user.id, updateBusinessDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un negocio' })
  @ApiResponse({ status: 200, description: 'Negocio eliminado' })
  @ApiResponse({ status: 404, description: 'Negocio no encontrado' })
  async remove(@Param('id') id: string, @Request() req: any) {
    return this.businessesService.remove(id, req.user.id);
  }
}
