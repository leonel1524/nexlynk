import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, UpdateMenuItemDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('menus')
@Controller('businesses/:businessId/menus')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los menús de un negocio' })
  @ApiResponse({ status: 200, description: 'Lista de menús' })
  async findAll(@Param('businessId') businessId: string, @Request() req: any) {
    return this.menusService.findAll(businessId, req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un menú por ID' })
  @ApiResponse({ status: 200, description: 'Menú encontrado' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  async findOne(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    return this.menusService.findOne(id, businessId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo menú' })
  @ApiResponse({ status: 201, description: 'Menú creado' })
  async create(
    @Param('businessId') businessId: string,
    @Body() createMenuDto: CreateMenuDto,
    @Request() req: any,
  ) {
    return this.menusService.create(businessId, req.user.id, createMenuDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un menú' })
  @ApiResponse({ status: 200, description: 'Menú actualizado' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  async update(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Body() updateMenuDto: UpdateMenuDto,
    @Request() req: any,
  ) {
    return this.menusService.update(id, businessId, req.user.id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un menú' })
  @ApiResponse({ status: 200, description: 'Menú eliminado' })
  @ApiResponse({ status: 404, description: 'Menú no encontrado' })
  async remove(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    return this.menusService.remove(id, businessId, req.user.id);
  }

  // Menu Items
  @Put('items/:itemId')
  @ApiOperation({ summary: 'Actualizar un item del menú' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    return this.menusService.updateItem(itemId, dto);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Eliminar un item del menú' })
  async removeItem(@Param('itemId') itemId: string) {
    return this.menusService.removeItem(itemId);
  }
}
