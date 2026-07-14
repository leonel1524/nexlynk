import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Location } from '@nexlynk/shared';

@Component({
  selector: 'app-location-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
          <h1 class="text-2xl font-bold text-gray-900">Ubicaciones</h1>
          <p class="text-gray-600">Gestiona las ubicaciones de tu negocio</p>
        </div>
        <a [routerLink]="['/businesses', businessId, 'locations', 'new']" class="btn-primary">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nueva ubicación
          </span>
        </a>
      </div>

      @if (locations.length === 0) {
        <div class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <p class="text-gray-500 mb-4">No tienes ubicaciones creadas</p>
          <a [routerLink]="['/businesses', businessId, 'locations', 'new']" class="btn-primary">
            Agregar primera ubicación
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (location of locations; track location.id) {
            <div class="card hover:shadow-lg transition-shadow">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4">
                  <div class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg class="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="text-lg font-semibold text-gray-900">{{ location.name }}</h3>
                      @if (location.is_main) {
                        <span class="px-2 py-0.5 text-xs font-medium bg-brand/10 text-brand rounded">Principal</span>
                      }
                    </div>
                    <p class="text-gray-600 text-sm">{{ location.address }}</p>
                    
                    @if (location.schedule) {
                      <div class="mt-2 text-sm text-gray-500">
                        @for (entry of getScheduleEntries(location.schedule); track entry[0]) {
                          <p><span class="font-medium">{{ entry[0] }}:</span> {{ entry[1] }}</p>
                        }
                      </div>
                    }
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <a [routerLink]="['/businesses', businessId, 'locations', location.id, 'edit']" class="btn-ghost text-sm">
                    Editar
                  </a>
                  <button (click)="deleteLocation(location.id)" class="text-red-500 hover:text-red-600 p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class LocationListComponent implements OnInit {
  businessId: string = '';
  locations: Location[] = [];

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    if (this.businessId) {
      this.loadLocations();
    }
  }

  loadLocations(): void {
    this.businessService.getLocations(this.businessId).subscribe({
      next: (response) => {
        this.locations = response.data || [];
      }
    });
  }

  getScheduleEntries(schedule: Record<string, string>): [string, string][] {
    return Object.entries(schedule);
  }

  deleteLocation(locationId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta ubicación?')) {
      this.businessService.deleteLocation(this.businessId, locationId).subscribe({
        next: () => {
          this.loadLocations();
        }
      });
    }
  }
}
