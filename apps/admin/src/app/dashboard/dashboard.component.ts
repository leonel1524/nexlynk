import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Business } from '@nexlynk/shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-8">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600">Bienvenido a tu panel de administración</p>
        </div>
        <a routerLink="/businesses/new" class="btn-primary">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo negocio
          </span>
        </a>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="card">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Negocios</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.businesses }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Menús</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.menus }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Ubicaciones</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.locations }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-500">Visitas</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats.visits }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Businesses -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-900">Negocios recientes</h2>
          <a routerLink="/businesses" class="text-brand hover:text-brand-dark text-sm font-medium">
            Ver todos →
          </a>
        </div>

        @if (businesses.length === 0) {
          <div class="text-center py-12">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
            <p class="text-gray-500 mb-4">No tienes negocios aún</p>
            <a routerLink="/businesses/new" class="btn-primary">
              Crear mi primer negocio
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (business of businesses; track business.id) {
              <div class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div class="flex items-center gap-4">
                  @if (business.logo_url) {
                    <img [src]="business.logo_url" [alt]="business.name" class="w-12 h-12 rounded-xl object-cover" />
                  } @else {
                    <div class="w-12 h-12 bg-brand/10 rounded-xl flex items-center justify-center">
                      <span class="text-brand font-bold text-lg">{{ business.name.charAt(0) }}</span>
                    </div>
                  }
                  <div>
                    <h3 class="font-medium text-gray-900">{{ business.name }}</h3>
                    <p class="text-sm text-gray-500">{{ business.slug }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                        [class]="business.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ business.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                  <a [routerLink]="['/businesses', business.id]" class="btn-ghost text-sm">
                    Ver
                  </a>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  businesses: Business[] = [];
  stats = {
    businesses: 0,
    menus: 0,
    locations: 0,
    visits: 0
  };

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.businessService.getAll().subscribe({
      next: (response) => {
        this.businesses = response.data || [];
        this.stats.businesses = response.total || 0;
      },
      error: () => {
        // Handle error - use mock data for now
        this.businesses = [];
        this.stats = { businesses: 0, menus: 0, locations: 0, visits: 0 };
      }
    });
  }
}
