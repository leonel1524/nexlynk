import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { CreateLocationDto, UpdateLocationDto } from './dto/location.dto';

@Injectable()
export class LocationsService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockFindAll();
    }

    const { data, error } = await this.supabaseService.client
      .from('locations')
      .select('*')
      .eq('business_id', businessId)
      .order('is_main', { ascending: false });

    if (error) {
      console.error('❌ Find locations error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al obtener ubicaciones');
    }
    return data;
  }

  async findOne(id: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockFindOne(id);
    }

    const { data, error } = await this.supabaseService.client
      .from('locations')
      .select('*')
      .eq('id', id)
      .eq('business_id', businessId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Ubicación no encontrada');
    }

    return data;
  }

  async create(businessId: string, userId: string, createLocationDto: CreateLocationDto) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockCreate(createLocationDto);
    }

    // If this is main, unset other main locations
    if (createLocationDto.is_main) {
      await this.supabaseService.client
        .from('locations')
        .update({ is_main: false })
        .eq('business_id', businessId)
        .eq('is_main', true);
    }

    const { data, error } = await this.supabaseService.client
      .from('locations')
      .insert({
        business_id: businessId,
        ...createLocationDto,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Create location error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al crear la ubicación');
    }
    return data;
  }

  async update(id: string, businessId: string, userId: string, updateLocationDto: UpdateLocationDto) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockUpdate(id, updateLocationDto);
    }

    // If setting as main, unset other main locations
    if (updateLocationDto.is_main) {
      await this.supabaseService.client
        .from('locations')
        .update({ is_main: false })
        .eq('business_id', businessId)
        .eq('is_main', true)
        .neq('id', id);
    }

    const { data, error } = await this.supabaseService.client
      .from('locations')
      .update(updateLocationDto)
      .eq('id', id)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update location error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al actualizar la ubicación');
    }
    return data;
  }

  async remove(id: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockRemove(id);
    }

    const { error } = await this.supabaseService.client
      .from('locations')
      .delete()
      .eq('id', id)
      .eq('business_id', businessId);

    if (error) {
      console.error('❌ Delete location error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al eliminar la ubicación');
    }
    return { message: 'Ubicación eliminada correctamente' };
  }

  private async verifyOwnership(businessId: string, userId: string) {
    if (!this.supabaseService.isConfigured) return;

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .select('owner_id')
      .eq('id', businessId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Negocio no encontrado');
    }

    if (data.owner_id !== userId) {
      throw new ForbiddenException('No tienes acceso a este negocio');
    }
  }

  // Mock methods
  private mockFindAll() {
    return [
      {
        id: '1',
        name: 'Sede Principal',
        address: 'Av. Principal, Caracas',
        latitude: 10.4806,
        longitude: -66.9036,
        schedule: { 'Lun-Vie': '8am-10pm', 'Sáb': '9am-11pm' },
        is_main: true,
      },
    ];
  }

  private mockFindOne(id: string) {
    return {
      id,
      name: 'Sede Principal',
      address: 'Av. Principal, Caracas',
      latitude: 10.4806,
      longitude: -66.9036,
      schedule: { 'Lun-Vie': '8am-10pm' },
      is_main: true,
    };
  }

  private mockCreate(dto: CreateLocationDto) {
    return {
      id: 'new-' + Date.now(),
      ...dto,
    };
  }

  private mockUpdate(id: string, dto: UpdateLocationDto) {
    return { id, ...dto };
  }

  private mockRemove(id: string) {
    return { message: 'Ubicación eliminada correctamente' };
  }
}
