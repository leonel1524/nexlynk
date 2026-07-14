import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Menu } from '@nexlynk/shared';

@Component({
  selector: 'app-menu-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <a [routerLink]="['/businesses', businessId, 'menus']" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver a menús
        </a>
      </div>

      <div class="card">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Editar menú' : 'Crear nuevo menú' }}
        </h1>

        <form [formGroup]="menuForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="label">Nombre del menú *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="input-field"
              placeholder="Menú Principal"
            />
            @if (menuForm.get('name')?.invalid && menuForm.get('name')?.touched) {
              <p class="error-text">El nombre es requerido</p>
            }
          </div>

          <div>
            <label for="description" class="label">Descripción</label>
            <textarea
              id="description"
              formControlName="description"
              class="input-field"
              rows="3"
              placeholder="Describe este menú..."
            ></textarea>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" [disabled]="menuForm.invalid || isLoading" class="btn-primary">
              {{ isEditing ? 'Guardar cambios' : 'Crear menú' }}
            </button>
            <a [routerLink]="['/businesses', businessId, 'menus']" class="btn-ghost">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class MenuFormComponent implements OnInit {
  menuForm: FormGroup;
  businessId: string = '';
  menuId: string | null = null;
  isEditing = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    this.menuId = this.route.snapshot.paramMap.get('menuId');
    
    if (this.menuId) {
      this.isEditing = true;
    }
  }

  onSubmit(): void {
    if (this.menuForm.invalid) return;

    this.isLoading = true;

    const request = this.isEditing
      ? this.businessService.updateMenu(this.businessId, this.menuId!, this.menuForm.value)
      : this.businessService.createMenu(this.businessId, this.menuForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/businesses', this.businessId, 'menus']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
