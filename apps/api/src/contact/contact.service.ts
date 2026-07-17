import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';
import { CreateContactMessageDto } from './dto/contact.dto';

@Injectable()
export class ContactService {
  constructor(private supabaseService: SupabaseService) {}

  async create(businessId: string, dto: CreateContactMessageDto, ip?: string, userAgent?: string) {
    if (!this.supabaseService.isConfigured) {
      return this.mockCreate(dto);
    }

    const { data: business, error: businessError } = await this.supabaseService.client
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('is_active', true)
      .single();

    if (businessError || !business) {
      throw new NotFoundException('Negocio no encontrado');
    }

    const { data, error } = await this.supabaseService.client
      .from('contact_messages')
      .insert({
        business_id: businessId,
        name: dto.name,
        email: dto.email,
        phone: dto.phone || null,
        message: dto.message,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Create contact message error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al enviar el mensaje');
    }

    return data;
  }

  async findByBusiness(businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return this.mockFindAll();
    }

    const { data, error } = await this.supabaseService.client
      .from('contact_messages')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Find contact messages error:', JSON.stringify(error));
      throw new InternalServerErrorException('Error al obtener mensajes');
    }

    return data;
  }

  async markAsRead(id: string, businessId: string, userId: string) {
    await this.verifyOwnership(businessId, userId);

    if (!this.supabaseService.isConfigured) {
      return { id, is_read: true };
    }

    const { data, error } = await this.supabaseService.client
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error || !data) {
      throw new NotFoundException('Mensaje no encontrado');
    }

    return data;
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
      throw new NotFoundException('Negocio no encontrado');
    }
  }

  private mockCreate(dto: CreateContactMessageDto) {
    return {
      id: 'mock-' + Date.now(),
      business_id: 'mock-business',
      ...dto,
      is_read: false,
      created_at: new Date().toISOString(),
    };
  }

  private mockFindAll() {
    return [
      {
        id: '1',
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '+1 234 567 890',
        message: 'Me gustaría información sobre sus servicios.',
        is_read: false,
        created_at: new Date().toISOString(),
      },
    ];
  }
}
