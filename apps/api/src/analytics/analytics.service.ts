import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase/supabase.service';

export interface AnalyticsEvent {
  business_id: string;
  event_type: string;
  metadata?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export interface AnalyticsSummary {
  total_views: number;
  total_whatsapp_clicks: number;
  total_maps_clicks: number;
  total_phone_clicks: number;
  total_menu_views: number;
  recent_events: any[];
}

@Injectable()
export class AnalyticsService {
  constructor(private supabaseService: SupabaseService) {}

  async trackEvent(event: AnalyticsEvent) {
    if (!this.supabaseService.isConfigured) {
      return { id: 'mock-' + Date.now(), ...event, created_at: new Date().toISOString() };
    }

    const { data, error } = await this.supabaseService.client
      .from('analytics_events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getBusinessAnalytics(businessId: string, days = 30): Promise<AnalyticsSummary> {
    if (!this.supabaseService.isConfigured) {
      return this.mockAnalytics();
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get event counts by type
    const { data: events } = await this.supabaseService.client
      .from('analytics_events')
      .select('event_type')
      .eq('business_id', businessId)
      .gte('created_at', startDate.toISOString());

    const counts = {
      total_views: 0,
      total_whatsapp_clicks: 0,
      total_maps_clicks: 0,
      total_phone_clicks: 0,
      total_menu_views: 0,
    };

    events?.forEach((event) => {
      switch (event.event_type) {
        case 'page_view':
          counts.total_views++;
          break;
        case 'click_whatsapp':
          counts.total_whatsapp_clicks++;
          break;
        case 'click_maps':
          counts.total_maps_clicks++;
          break;
        case 'click_phone':
          counts.total_phone_clicks++;
          break;
        case 'view_menu':
          counts.total_menu_views++;
          break;
      }
    });

    // Get recent events
    const { data: recentEvents } = await this.supabaseService.client
      .from('analytics_events')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(10);

    return {
      ...counts,
      recent_events: recentEvents || [],
    };
  }

  async getDashboardStats(businessId: string) {
    if (!this.supabaseService.isConfigured) {
      return { views: 1234, clicks: 456, orders: 78 };
    }

    const { count: views } = await this.supabaseService.client
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('event_type', 'page_view');

    const { count: clicks } = await this.supabaseService.client
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .in('event_type', ['click_whatsapp', 'click_maps', 'click_phone']);

    const { count: orders } = await this.supabaseService.client
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('event_type', 'select_item');

    return {
      views: views || 0,
      clicks: clicks || 0,
      orders: orders || 0,
    };
  }

  private mockAnalytics(): AnalyticsSummary {
    return {
      total_views: 1234,
      total_whatsapp_clicks: 456,
      total_maps_clicks: 123,
      total_phone_clicks: 67,
      total_menu_views: 890,
      recent_events: [
        {
          id: '1',
          event_type: 'page_view',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          event_type: 'click_whatsapp',
          created_at: new Date().toISOString(),
        },
      ],
    };
  }
}
