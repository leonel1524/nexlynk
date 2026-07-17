import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { CreateMenuDto, UpdateMenuDto, UpdateMenuItemDto } from './dto/menu.dto';

@Injectable()
export class MenusService {
  constructor(private supabaseService: SupabaseService) {}

  async findAll(businessId: string, userId: string) {
    // Verify business ownership
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockFindAll();
    }

    const { data, error } = await this.supabaseService.client
      .from('menus')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .eq('business_id', businessId)
      .order('sort_order');

    if (error) {
      console.error('❌ Find menus error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al obtener menús');
    }
    return data;
  }

  async findOne(id: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockFindOne(id);
    }

    const { data, error } = await this.supabaseService.client
      .from('menus')
      .select(`
        *,
        menu_categories (
          *,
          menu_items (*)
        )
      `)
      .eq('id', id)
      .eq('business_id', businessId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Menú no encontrado');
    }

    return data;
  }

  async create(businessId: string, userId: string, createMenuDto: CreateMenuDto) {
    console.log('🔥 MENUS SERVICE CREATE called. businessId:', businessId, 'userId:', userId);
    console.log('📝 Create menu DTO:', JSON.stringify(createMenuDto, null, 2));

    await this.verifyOwnership(businessId, userId);
    console.log('✅ Ownership verified');

    if (!this.supabaseService.isConfigured) {
      console.log('⚠️ Supabase not configured, using mock');
      return this.mockCreate(createMenuDto);
    }

    const { categories, ...menuData } = createMenuDto;

    console.log('📝 Menu data (without categories):', JSON.stringify(menuData));
    console.log('📝 Categories count:', categories?.length || 0);

    // Create menu
    const { data: menu, error: menuError } = await this.supabaseService.client
      .from('menus')
      .insert({
        business_id: businessId,
        ...menuData,
        is_active: true,
        sort_order: 0,
      })
      .select()
      .single();

    if (menuError) {
      console.error('❌ Create menu error:', JSON.stringify(menuError));
      throw new InternalServerErrorException('Error al crear el menú');
    }

    console.log('✅ Menu created:', menu.id, menu.name);

    // Create categories and items
    if (categories?.length) {
      for (let i = 0; i < categories.length; i++) {
        const { items, ...categoryData } = categories[i];

        const { data: category, error: catError } = await this.supabaseService.client
          .from('menu_categories')
          .insert({
            menu_id: menu.id,
            ...categoryData,
            sort_order: i,
          })
          .select()
          .single();

        if (catError) {
          console.error('❌ Create category error:', JSON.stringify(catError));
          throw new InternalServerErrorException(`Error al crear categoría: ${catError.message}`);
        }

        if (category && items?.length) {
          for (let j = 0; j < items.length; j++) {
            const { error: itemError } = await this.supabaseService.client
              .from('menu_items')
              .insert({
                category_id: category.id,
                ...items[j],
                is_available: true,
                sort_order: j,
              });

            if (itemError) {
              console.error('❌ Create menu item error:', JSON.stringify(itemError));
              throw new InternalServerErrorException(`Error al crear item: ${itemError.message}`);
            }
          }
        }
      }
    }

    return this.findOne(menu.id, businessId, userId);
  }

  async update(id: string, businessId: string, userId: string, updateMenuDto: UpdateMenuDto) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockUpdate(id, updateMenuDto);
    }

    const { categories, ...menuData } = updateMenuDto;

    const { data, error } = await this.supabaseService.client
      .from('menus')
      .update(menuData)
      .eq('id', id)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update menu error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al actualizar el menú');
    }

    // If categories were sent, replace all existing categories and items
    if (categories) {
      // Get existing category IDs
      const { data: existingCats } = await this.supabaseService.client
        .from('menu_categories')
        .select('id')
        .eq('menu_id', id);

      if (existingCats?.length) {
        const catIds = existingCats.map(c => c.id);

        // Delete existing menu_items for these categories
        await this.supabaseService.client
          .from('menu_items')
          .delete()
          .in('category_id', catIds);

        // Delete existing categories
        await this.supabaseService.client
          .from('menu_categories')
          .delete()
          .eq('menu_id', id);
      }

      // Insert new categories and items
      for (let i = 0; i < categories.length; i++) {
        const { items, ...categoryData } = categories[i];

        const { data: category, error: catError } = await this.supabaseService.client
          .from('menu_categories')
          .insert({
            menu_id: id,
            ...categoryData,
            sort_order: i,
          })
          .select()
          .single();

        if (catError) {
          console.error('❌ Update category error:', JSON.stringify(catError));
          throw new InternalServerErrorException(`Error al actualizar categoría: ${catError.message}`);
        }

        if (category && items?.length) {
          for (let j = 0; j < items.length; j++) {
            const { error: itemError } = await this.supabaseService.client
              .from('menu_items')
              .insert({
                category_id: category.id,
                ...items[j],
                is_available: true,
                sort_order: j,
              });

            if (itemError) {
              console.error('❌ Update menu item error:', JSON.stringify(itemError));
              throw new InternalServerErrorException(`Error al actualizar item: ${itemError.message}`);
            }
          }
        }
      }
    }

    return this.findOne(id, businessId, userId);
  }

  async remove(id: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockRemove(id);
    }

    const { error } = await this.supabaseService.client
      .from('menus')
      .delete()
      .eq('id', id)
      .eq('business_id', businessId);

    if (error) {
      console.error('❌ Delete menu error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al eliminar el menú');
    }
    return { message: 'Menú eliminado correctamente' };
  }

  // Menu Items
  async updateItem(itemId: string, businessId: string, userId: string, dto: UpdateMenuItemDto) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return { id: itemId, ...dto };
    }

    const { data, error } = await this.supabaseService.client
      .from('menu_items')
      .update(dto)
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('❌ Update menu item error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al actualizar el item');
    }
    return data;
  }

  async removeItem(itemId: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return { message: 'Item eliminado' };
    }

    const { error } = await this.supabaseService.client
      .from('menu_items')
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('❌ Delete menu item error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al eliminar el item');
    }
    return { message: 'Item eliminado correctamente' };
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
        name: 'Menú Principal',
        is_active: true,
        sort_order: 0,
        menu_categories: [
          {
            id: '1',
            name: 'Entradas',
            sort_order: 0,
            menu_items: [
              { id: '1', name: 'Empanadas', price: 3.5, is_available: true },
              { id: '2', name: 'Tequeños', price: 5, is_available: true },
            ],
          },
        ],
      },
    ];
  }

  private mockFindOne(id: string) {
    return {
      id,
      name: 'Menú Principal',
      is_active: true,
      sort_order: 0,
      menu_categories: [],
    };
  }

  private mockCreate(dto: CreateMenuDto) {
    return {
      id: 'new-' + Date.now(),
      ...dto,
      is_active: true,
      sort_order: 0,
      menu_categories: dto.categories?.map((c, i) => ({
        id: `cat-${i}`,
        ...c,
        sort_order: i,
        menu_items: c.items?.map((item, j) => ({
          id: `item-${i}-${j}`,
          ...item,
          is_available: true,
          sort_order: j,
        })) || [],
      })) || [],
    };
  }

  private mockUpdate(id: string, dto: UpdateMenuDto) {
    return { id, ...dto };
  }

  private mockRemove(id: string) {
    return { message: 'Menú eliminado correctamente' };
  }
}
