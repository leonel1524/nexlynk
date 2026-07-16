import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, UpdateMenuItemDto } from './dto/menu.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { apiResponse, apiMessage } from '../common/dto/api-response';

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
    const data = await this.menusService.findAll(businessId, req.user.id);
    return apiResponse(data);
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
    const data = await this.menusService.findOne(id, businessId, req.user.id);
    return apiResponse(data);
  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo menú' })
  @ApiResponse({ status: 201, description: 'Menú creado' })
  async create(
    @Param('businessId') businessId: string,
    @Body() createMenuDto: CreateMenuDto,
    @Request() req: any,
  ) {
    const data = await this.menusService.create(businessId, req.user.id, createMenuDto);
    return apiResponse(data);
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
    const data = await this.menusService.update(id, businessId, req.user.id, updateMenuDto);
    return apiResponse(data);
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
    await this.menusService.remove(id, businessId, req.user.id);
    return apiMessage('Menú eliminado correctamente');
  }

  // Menu Items
  @Put('items/:itemId')
  @ApiOperation({ summary: 'Actualizar un item del menú' })
  async updateItem(
    @Param('itemId') itemId: string,
    @Body() dto: UpdateMenuItemDto,
  ) {
    const data = await this.menusService.updateItem(itemId, dto);
    return apiResponse(data);
  }

  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Eliminar un item del menú' })
  async removeItem(@Param('itemId') itemId: string) {
    await this.menusService.removeItem(itemId);
    return apiMessage('Item eliminado correctamente');
  }
}
