import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { apiResponse, apiMessage } from '../common/dto/api-response';

@ApiTags('locations')
@Controller('businesses/:businessId/locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las ubicaciones de un negocio' })
  @ApiResponse({ status: 200, description: 'Lista de ubicaciones' })
  async findAll(@Param('businessId') businessId: string, @Request() req: any) {
    const data = await this.locationsService.findAll(businessId, req.user.id);
    return apiResponse(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una ubicación por ID' })
  @ApiResponse({ status: 200, description: 'Ubicación encontrada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async findOne(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    const data = await this.locationsService.findOne(id, businessId, req.user.id);
    return apiResponse(data);
  }

  @Post()
  @ApiOperation({ summary: 'Crear una nueva ubicación' })
  @ApiResponse({ status: 201, description: 'Ubicación creada' })
  async create(
    @Param('businessId') businessId: string,
    @Body() createLocationDto: CreateLocationDto,
    @Request() req: any,
  ) {
    const data = await this.locationsService.create(businessId, req.user.id, createLocationDto);
    return apiResponse(data);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación actualizada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async update(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Request() req: any,
  ) {
    const data = await this.locationsService.update(id, businessId, req.user.id, updateLocationDto);
    return apiResponse(data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una ubicación' })
  @ApiResponse({ status: 200, description: 'Ubicación eliminada' })
  @ApiResponse({ status: 404, description: 'Ubicación no encontrada' })
  async remove(
    @Param('id') id: string,
    @Param('businessId') businessId: string,
    @Request() req: any,
  ) {
    await this.locationsService.remove(id, businessId, req.user.id);
    return apiMessage('Ubicación eliminada correctamente');
  }
}
