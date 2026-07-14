import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Menu } from '@nexlynk/shared';

@Component({
  selector: 'app-menu-list',
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
          <h1 class="text-2xl font-bold text-gray-900">Menús</h1>
          <p class="text-gray-600">Gestiona los menús de tu negocio</p>
        </div>
        <a [routerLink]="['/businesses', businessId, 'menus', 'new']" class="btn-primary">
          <span class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            Nuevo menú
          </span>
        </a>
      </div>

      @if (menus.length === 0) {
        <div class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p class="text-gray-500 mb-4">No tienes menús creados</p>
          <a [routerLink]="['/businesses', businessId, 'menus', 'new']" class="btn-primary">
            Crear primer menú
          </a>
        </div>
      } @else {
        <div class="space-y-4">
          @for (menu of menus; track menu.id) {
            <div class="card hover:shadow-lg transition-shadow">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">{{ menu.name }}</h3>
                  @if (menu.description) {
                    <p class="text-gray-600 text-sm">{{ menu.description }}</p>
                  }
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 text-xs font-medium rounded-full"
                        [class]="menu.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'">
                    {{ menu.is_active ? 'Activo' : 'Inactivo' }}
                  </span>
                  <a [routerLink]="['/businesses', businessId, 'menus', menu.id, 'edit']" class="btn-ghost text-sm">
                    Editar
                  </a>
                  <button (click)="deleteMenu(menu.id)" class="text-red-500 hover:text-red-600 p-2">
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
export class MenuListComponent implements OnInit {
  businessId: string = '';
  menus: Menu[] = [];

  constructor(
    private businessService: BusinessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    if (this.businessId) {
      this.loadMenus();
    }
  }

  loadMenus(): void {
    this.businessService.getMenus(this.businessId).subscribe({
      next: (response) => {
        this.menus = response.data || [];
      }
    });
  }

  deleteMenu(menuId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este menú?')) {
      this.businessService.deleteMenu(this.businessId, menuId).subscribe({
        next: () => {
          this.loadMenus();
        }
      });
    }
  }
}
