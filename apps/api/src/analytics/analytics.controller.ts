import { Controller, Post, Get, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post('track')
  @ApiOperation({ summary: 'Registrar un evento de analytics' })
  @ApiResponse({ status: 201, description: 'Evento registrado' })
  async trackEvent(
    @Body() body: {
      business_id: string;
      event_type: string;
      metadata?: Record<string, any>;
    },
    @Request() req: any,
  ) {
    return this.analyticsService.trackEvent({
      ...body,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
    });
  }

  @Get('business/:businessId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener analytics de un negocio' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Resumen de analytics' })
  async getBusinessAnalytics(
    @Param('businessId') businessId: string,
    @Query('days') days?: number,
  ) {
    return this.analyticsService.getBusinessAnalytics(businessId, days);
  }

  @Get('business/:businessId/stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard' })
  @ApiResponse({ status: 200, description: 'Estadísticas' })
  async getDashboardStats(@Param('businessId') businessId: string) {
    return this.analyticsService.getDashboardStats(businessId);
  }
}
