import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Business } from '@nexlynk/shared';

@Component({
  selector: 'app-business-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <a routerLink="/businesses" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver a negocios
        </a>
      </div>

      <div class="card">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Editar negocio' : 'Crear nuevo negocio' }}
        </h1>

        <form [formGroup]="businessForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="label">Nombre del negocio *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="input-field"
              placeholder="Mi Negocio"
            />
            @if (businessForm.get('name')?.invalid && businessForm.get('name')?.touched) {
              <p class="error-text">El nombre es requerido</p>
            }
          </div>

          <div>
            <label for="slug" class="label">URL del negocio *</label>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">nexlynk.app/</span>
              <input
                id="slug"
                type="text"
                formControlName="slug"
                class="input-field flex-1"
                placeholder="mi-negocio"
              />
            </div>
            @if (businessForm.get('slug')?.invalid && businessForm.get('slug')?.touched) {
              <p class="error-text">El slug es requerido (solo letras minúsculas, números y guiones)</p>
            }
          </div>

          <div>
            <label for="description" class="label">Descripción</label>
            <textarea
              id="description"
              formControlName="description"
              class="input-field"
              rows="3"
              placeholder="Describe tu negocio..."
            ></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="phone" class="label">Teléfono</label>
              <input
                id="phone"
                type="tel"
                formControlName="phone"
                class="input-field"
                placeholder="+58 412 1234567"
              />
            </div>

            <div>
              <label for="whatsapp" class="label">WhatsApp</label>
              <input
                id="whatsapp"
                type="tel"
                formControlName="whatsapp"
                class="input-field"
                placeholder="+58 412 1234567"
              />
            </div>
          </div>

          <div>
            <label for="email" class="label">Correo electrónico</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              class="input-field"
              placeholder="info@minegocio.com"
            />
          </div>

          <div>
            <label for="website" class="label">Sitio web</label>
            <input
              id="website"
              type="url"
              formControlName="website"
              class="input-field"
              placeholder="https://minegocio.com"
            />
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" [disabled]="businessForm.invalid || isLoading" class="btn-primary">
              {{ isEditing ? 'Guardar cambios' : 'Crear negocio' }}
            </button>
            <a routerLink="/businesses" class="btn-ghost">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BusinessFormComponent implements OnInit {
  businessForm: FormGroup;
  isEditing = false;
  businessId: string | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      description: [''],
      phone: [''],
      whatsapp: [''],
      email: ['', Validators.email],
      website: ['']
    });
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id');
    if (this.businessId) {
      this.isEditing = true;
      this.loadBusiness();
    }
  }

  loadBusiness(): void {
    if (!this.businessId) return;

    this.businessService.getById(this.businessId).subscribe({
      next: (response) => {
        if (response.data) {
          this.businessForm.patchValue(response.data);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const request = this.isEditing
      ? this.businessService.update(this.businessId!, this.businessForm.value)
      : this.businessService.create(this.businessForm.value);

    request.subscribe({
      next: () => {
        this.router.navigate(['/businesses']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al guardar el negocio';
      }
    });
  }
}
