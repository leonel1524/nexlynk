import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Business } from '@nexlynk/shared';

@Component({
  selector: 'app-business-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <a routerLink="/businesses" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver a negocios
          </a>
          <h1 class="text-2xl font-bold text-gray-900">{{ business?.name }}</h1>
          <p class="text-gray-600">/{{ business?.slug }}</p>
        </div>
        <div class="flex items-center gap-2">
          <a [routerLink]="['/businesses', businessId, 'edit']" class="btn-primary">
            Editar
          </a>
          <button (click)="deleteBusiness()" class="btn-danger">
            Eliminar
          </button>
        </div>
      </div>

      @if (business) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Business Info -->
          <div class="lg:col-span-2 space-y-6">
            <div class="card">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Información del negocio</h2>
              
              <div class="space-y-4">
                @if (business.description) {
                  <div>
                    <p class="text-sm text-gray-500">Descripción</p>
                    <p class="text-gray-900">{{ business.description }}</p>
                  </div>
                }

                <div class="grid grid-cols-2 gap-4">
                  @if (business.phone) {
                    <div>
                      <p class="text-sm text-gray-500">Teléfono</p>
                      <p class="text-gray-900">{{ business.phone }}</p>
                    </div>
                  }
                  @if (business.whatsapp) {
                    <div>
                      <p class="text-sm text-gray-500">WhatsApp</p>
                      <p class="text-gray-900">{{ business.whatsapp }}</p>
                    </div>
                  }
                  @if (business.email) {
                    <div>
                      <p class="text-sm text-gray-500">Email</p>
                      <p class="text-gray-900">{{ business.email }}</p>
                    </div>
                  }
                  @if (business.website) {
                    <div>
                      <p class="text-sm text-gray-500">Sitio web</p>
                      <a [href]="business.website" target="_blank" class="text-brand hover:underline">
                        {{ business.website }}
                      </a>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="card">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
              <div class="grid grid-cols-2 gap-4">
                <a [routerLink]="['/businesses', businessId, 'menus']" 
                   class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Menús</p>
                    <p class="text-sm text-gray-500">Gestionar menús</p>
                  </div>
                </a>

                <a [routerLink]="['/businesses', businessId, 'locations']" 
                   class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Ubicaciones</p>
                    <p class="text-sm text-gray-500">Gestionar sucursales</p>
                  </div>
                </a>

                <a [routerLink]="['/businesses', businessId, 'analytics']" 
                   class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Analytics</p>
                    <p class="text-sm text-gray-500">Ver estadísticas</p>
                  </div>
                </a>

                <a [routerLink]="['/businesses', businessId, 'contact-messages']" 
                   class="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <p class="font-medium text-gray-900">Mensajes</p>
                    <p class="text-sm text-gray-500">Contacto de clientes</p>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="card">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Vista previa</h2>
              <div class="aspect-[9/16] bg-gray-100 rounded-xl overflow-hidden">
                <div class="h-full flex flex-col items-center justify-center text-gray-400">
                  <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <p class="text-sm">Vista previa</p>
                </div>
              </div>
              <a [href]="'https://nexlynk.app/' + business.slug" 
                 target="_blank" 
                 class="mt-4 w-full btn-secondary text-center block text-sm">
                Ver página pública ↗
              </a>
            </div>

            <div class="card">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Estado</h2>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Estado</span>
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                        [class]="business.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ business.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Plan</span>
                  <span class="font-medium text-gray-900 capitalize">{{ business.plan }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600">Creado</span>
                  <span class="text-gray-900">{{ business.created_at | date:'dd/MM/yyyy' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class BusinessDetailComponent implements OnInit {
  business: Business | null = null;
  businessId: string = '';

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    if (this.businessId) {
      this.loadBusiness();
    }
  }

  loadBusiness(): void {
    this.businessService.getById(this.businessId).subscribe({
      next: (response) => {
        this.business = response.data || null;
      }
    });
  }

  deleteBusiness(): void {
    if (confirm('¿Estás seguro de que quieres eliminar este negocio?')) {
      this.businessService.delete(this.businessId).subscribe({
        next: () => {
          this.router.navigate(['/businesses']);
        }
      });
    }
  }
}
