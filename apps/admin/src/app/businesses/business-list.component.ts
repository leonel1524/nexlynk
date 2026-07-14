import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Business } from '@nexlynk/shared';

@Component({
  selector: 'app-business-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Negocios</h1>
          <p class="text-gray-600">Gestiona tus negocios</p>
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

      @if (businesses.length === 0) {
        <div class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          <p class="text-gray-500 mb-4">No tienes negocios creados</p>
          <a routerLink="/businesses/new" class="btn-primary">
            Crear mi primer negocio
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (business of businesses; track business.id) {
            <div class="card hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between mb-4">
                @if (business.logo_url) {
                  <img [src]="business.logo_url" [alt]="business.name" class="w-16 h-16 rounded-xl object-cover" />
                } @else {
                  <div class="w-16 h-16 bg-brand/10 rounded-xl flex items-center justify-center">
                    <span class="text-brand font-bold text-2xl">{{ business.name.charAt(0) }}</span>
                  </div>
                }
                <span class="px-3 py-1 text-xs font-medium rounded-full"
                      [class]="business.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                  {{ business.is_active ? 'Activo' : 'Inactivo' }}
                </span>
              </div>

              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ business.name }}</h3>
              <p class="text-sm text-gray-500 mb-4">/{{ business.slug }}</p>

              @if (business.description) {
                <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ business.description }}</p>
              }

              <div class="flex items-center gap-2 pt-4 border-t border-gray-100">
                <a [routerLink]="['/businesses', business.id]" class="flex-1 btn-secondary text-sm text-center">
                  Editar
                </a>
                <a [routerLink]="['/businesses', business.id, 'menus']" class="btn-ghost text-sm">
                  Menús
                </a>
                <a [routerLink]="['/businesses', business.id, 'locations']" class="btn-ghost text-sm">
                  Ubicaciones
                </a>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];

  constructor(private businessService: BusinessService) {}

  ngOnInit(): void {
    this.loadBusinesses();
  }

  loadBusinesses(): void {
    this.businessService.getAll().subscribe({
      next: (response) => {
        this.businesses = response.data || [];
      },
      error: () => {
        this.businesses = [];
      }
    });
  }
}
