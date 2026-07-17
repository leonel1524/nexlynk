import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BusinessService } from '../shared/services/business.service';
import { AnalyticsService, AnalyticsSummary } from '../shared/services/analytics.service';
import { Business } from '@nexlynk/shared';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <a [routerLink]="['/businesses', businessId]" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver al negocio
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Analytics</h1>
          <p class="text-gray-600">{{ business?.name }}</p>
        </div>
        <div class="flex items-center gap-2">
          <select [(ngModel)]="selectedDays" (ngModelChange)="loadAnalytics()" class="input-field w-auto">
            <option [value]="7">Últimos 7 días</option>
            <option [value]="30">Últimos 30 días</option>
            <option [value]="90">Últimos 90 días</option>
          </select>
        </div>
      </div>

      @if (loading) {
        <div class="card text-center py-12">
          <div class="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500">Cargando analytics...</p>
        </div>
      } @else if (analytics) {
        <!-- Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div class="card">
            <div class="text-center">
              <div class="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_views }}</p>
              <p class="text-xs text-gray-500">Visitas</p>
            </div>
          </div>

          <div class="card">
            <div class="text-center">
              <div class="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_whatsapp_clicks }}</p>
              <p class="text-xs text-gray-500">WhatsApp</p>
            </div>
          </div>

          <div class="card">
            <div class="text-center">
              <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_maps_clicks }}</p>
              <p class="text-xs text-gray-500">Mapas</p>
            </div>
          </div>

          <div class="card">
            <div class="text-center">
              <div class="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_phone_clicks }}</p>
              <p class="text-xs text-gray-500">Llamadas</p>
            </div>
          </div>

          <div class="card">
            <div class="text-center">
              <div class="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
              </div>
              <p class="text-2xl font-bold text-gray-900">{{ analytics.total_menu_views }}</p>
              <p class="text-xs text-gray-500">Menú</p>
            </div>
          </div>
        </div>

        <!-- Recent Events -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Eventos recientes</h2>
          
          @if (analytics.recent_events.length === 0) {
            <div class="text-center py-8">
              <p class="text-gray-500">No hay eventos en este período</p>
            </div>
          } @else {
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="text-left text-sm text-gray-500 border-b">
                    <th class="pb-3 font-medium">Tipo</th>
                    <th class="pb-3 font-medium">Fecha</th>
                    <th class="pb-3 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  @for (event of analytics.recent_events; track event.id) {
                    <tr class="text-sm">
                      <td class="py-3">
                        <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
                              [class]="getEventBadgeClass(event.event_type)">
                          {{ getEventLabel(event.event_type) }}
                        </span>
                      </td>
                      <td class="py-3 text-gray-600">{{ formatDate(event.created_at) }}</td>
                      <td class="py-3 text-gray-500 text-xs">{{ event.ip_address || '-' }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }
        </div>
      } @else {
        <div class="card text-center py-12">
          <p class="text-gray-500">Selecciona un negocio para ver sus analytics</p>
        </div>
      }
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
  businessId = '';
  business: Business | null = null;
  analytics: AnalyticsSummary | null = null;
  loading = true;
  selectedDays = 30;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private analyticsService: AnalyticsService
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    if (this.businessId) {
      this.loadBusiness();
      this.loadAnalytics();
    }
  }

  loadBusiness(): void {
    this.businessService.getById(this.businessId).subscribe({
      next: (response) => {
        this.business = response.data || null;
      }
    });
  }

  loadAnalytics(): void {
    this.loading = true;
    this.analyticsService.getBusinessAnalytics(this.businessId, this.selectedDays).subscribe({
      next: (response) => {
        this.analytics = response.data || null;
        this.loading = false;
      },
      error: () => {
        this.analytics = null;
        this.loading = false;
      }
    });
  }

  getEventLabel(type: string): string {
    const labels: Record<string, string> = {
      'page_view': 'Visita',
      'click_whatsapp': 'WhatsApp',
      'click_maps': 'Mapa',
      'click_phone': 'Llamada',
      'view_menu': 'Menú',
      'select_item': 'Item',
      'share': 'Compartir'
    };
    return labels[type] || type;
  }

  getEventBadgeClass(type: string): string {
    const classes: Record<string, string> = {
      'page_view': 'bg-gray-100 text-gray-700',
      'click_whatsapp': 'bg-green-100 text-green-700',
      'click_maps': 'bg-blue-100 text-blue-700',
      'click_phone': 'bg-purple-100 text-purple-700',
      'view_menu': 'bg-orange-100 text-orange-700',
      'select_item': 'bg-yellow-100 text-yellow-700',
      'share': 'bg-pink-100 text-pink-700'
    };
    return classes[type] || 'bg-gray-100 text-gray-700';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
