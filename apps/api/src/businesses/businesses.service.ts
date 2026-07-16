import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { CreateBusinessDto, UpdateBusinessDto } from './dto/business.dto';

@Injectable()
export class BusinessesService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(userId: string) {
    if (!this.supabaseService.isConfigured) {
      return this.mockFindAll();
    }

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    if (!this.supabaseService.isConfigured) {
      return this.mockFindOne(id);
    }

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new NotFoundException('Negocio no encontrado');
    }

    if (data.owner_id !== userId) {
      throw new ForbiddenException('No tienes acceso a este negocio');
    }

    return data;
  }

  async findBySlug(slug: string) {
    if (!this.supabaseService.isConfigured) {
      return this.mockFindBySlug(slug);
    }

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .select(`
        *,
        locations (*),
        menus (
          *,
          menu_categories (
            *,
            menu_items (*)
          )
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      throw new NotFoundException('Negocio no encontrado');
    }

    return data;
  }

  async create(userId: string, createBusinessDto: CreateBusinessDto) {
    if (!this.supabaseService.isConfigured) {
      return this.mockCreate(createBusinessDto);
    }

    // Auto-generate slug from name if not provided
    const slug = createBusinessDto.slug || this.generateSlug(createBusinessDto.name);

    // Check if slug is unique
    const { data: existing } = await this.supabaseService.client
      .from('businesses')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      throw new Error('El slug ya está en uso');
    }

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .insert({
        owner_id: userId,
        ...createBusinessDto,
        slug,
        is_active: true,
        plan: 'free',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, userId: string, updateBusinessDto: UpdateBusinessDto) {
    // Verify ownership
    await this.findOne(id, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockUpdate(id, updateBusinessDto);
    }

    const { data, error } = await this.supabaseService.client
      .from('businesses')
      .update(updateBusinessDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string, userId: string) {
    // Verify ownership
    await this.findOne(id, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockRemove(id);
    }

    const { error } = await this.supabaseService.client
      .from('businesses')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Negocio eliminado correctamente' };
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Mock methods for development
  private mockFindAll() {
    return [
      {
        id: '1',
        owner_id: 'mock-user-id',
        name: 'Restaurante El Sabor',
        slug: 'el-sabor',
        description: 'La mejor comida tradicional',
        is_active: true,
        plan: 'free',
        created_at: new Date().toISOString(),
      },
    ];
  }

  private mockFindOne(id: string) {
    return {
      id,
      owner_id: 'mock-user-id',
      name: 'Restaurante El Sabor',
      slug: 'el-sabor',
      description: 'La mejor comida tradicional',
      is_active: true,
      plan: 'free',
      created_at: new Date().toISOString(),
    };
  }

  private mockFindBySlug(slug: string) {
    return {
      id: '1',
      name: 'Restaurante El Sabor',
      slug,
      description: 'La mejor comida tradicional venezolana',
      phone: '+584121234567',
      whatsapp: '+584121234567',
      email: 'info@elsabor.com',
      is_active: true,
      plan: 'free',
      locations: [
        {
          id: '1',
          name: 'Sede Principal',
          address: 'Av. Principal, Caracas',
          latitude: 10.4806,
          longitude: -66.9036,
          schedule: { 'Lun-Vie': '8am-10pm', 'Sáb': '9am-11pm' },
          is_main: true,
        },
      ],
      menus: [
        {
          id: '1',
          name: 'Menú Principal',
          is_active: true,
          menu_categories: [
            {
              id: '1',
              name: 'Entradas',
              menu_items: [
                { id: '1', name: 'Empanadas', price: 3.5, is_available: true },
                { id: '2', name: 'Tequeños', price: 5, is_available: true },
              ],
            },
          ],
        },
      ],
    };
  }

  private mockCreate(dto: CreateBusinessDto) {
    return {
      id: 'new-' + Date.now(),
      owner_id: 'mock-user-id',
      ...dto,
      is_active: true,
      plan: 'free',
      created_at: new Date().toISOString(),
    };
  }

  private mockUpdate(id: string, dto: UpdateBusinessDto) {
    return {
      id,
      ...dto,
      updated_at: new Date().toISOString(),
    };
  }

  private mockRemove(id: string) {
    return { message: 'Negocio eliminado correctamente' };
  }
}
