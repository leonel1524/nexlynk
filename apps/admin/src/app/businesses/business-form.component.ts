import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { UploadService } from '../shared/services/upload.service';
import { Business, BUSINESS_TYPES } from '@nexlynk/shared';
import { Subscription } from 'rxjs';

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
          <!-- Logo Upload -->
          <div>
            <label class="label">Logo del negocio</label>
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                @if (logoPreview) {
                  <img [src]="logoPreview" alt="Logo" class="w-full h-full object-cover" />
                } @else {
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                }
              </div>
              <div class="flex-1">
                <input
                  type="file"
                  #logoInput
                  accept="image/*"
                  (change)="onFileSelect($event, 'logo')"
                  class="hidden"
                />
                <button
                  type="button"
                  (click)="logoInput.click()"
                  [disabled]="isUploading"
                  class="btn-ghost text-sm"
                >
                  {{ isUploading ? 'Subiendo...' : 'Seleccionar logo' }}
                </button>
                <p class="text-xs text-gray-400 mt-1">JPG, PNG o WebP. Máx. 5MB.</p>
              </div>
            </div>
          </div>

          <!-- Cover Upload -->
          <div>
            <label class="label">Imagen de portada</label>
            <div class="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
              @if (coverPreview) {
                <img [src]="coverPreview" alt="Portada" class="w-full h-full object-cover" />
              } @else {
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              }
            </div>
            <input
              type="file"
              #coverInput
              accept="image/*"
              (change)="onFileSelect($event, 'cover')"
              class="hidden"
            />
            <button
              type="button"
              (click)="coverInput.click()"
              [disabled]="isUploading"
              class="btn-ghost text-sm mt-2"
            >
              {{ isUploading ? 'Subiendo...' : 'Seleccionar portada' }}
            </button>
            <p class="text-xs text-gray-400">JPG, PNG o WebP. Máx. 5MB.</p>
          </div>

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
            <label for="slug" class="label">URL del negocio</label>
            <div class="flex items-center gap-2">
              <span class="text-gray-500">nexlynk.app/</span>
              <input
                id="slug"
                type="text"
                formControlName="slug"
                class="input-field flex-1"
                placeholder="se-genera-automaticamente"
              />
            </div>
            <p class="text-xs text-gray-400 mt-1">Si lo dejas vacío, se genera automáticamente del nombre</p>
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

          <div>
            <label for="business_type" class="label">Tipo de negocio</label>
            <select
              id="business_type"
              formControlName="business_type"
              class="input-field"
            >
              <option value="">Seleccionar tipo...</option>
              @for (type of businessTypes; track type.value) {
                <option [value]="type.value">{{ type.label }}</option>
              }
            </select>
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
            <button type="submit" [disabled]="businessForm.invalid || isLoading || isUploading" class="btn-primary">
              {{ isEditing ? 'Guardar cambios' : 'Crear negocio' }}
            </button>
            <a routerLink="/businesses" class="btn-ghost">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BusinessFormComponent implements OnInit, OnDestroy {
  businessForm: FormGroup;
  isEditing = false;
  businessId: string | null = null;
  isLoading = false;
  isUploading = false;
  errorMessage = '';
  businessTypes = BUSINESS_TYPES;
  logoPreview: string | null = null;
  coverPreview: string | null = null;
  logoUrl: string | null = null;
  coverUrl: string | null = null;
  private slugSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private uploadService: UploadService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      slug: ['', [Validators.pattern(/^[a-z0-9-]*$/)]],
      description: [''],
      business_type: [''],
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

    this.slugSubscription = this.businessForm.get('name')?.valueChanges.subscribe((name: string) => {
      if (!this.isEditing && !this.businessForm.get('slug')?.value) {
        const slug = this.generateSlug(name);
        this.businessForm.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.slugSubscription?.unsubscribe();
  }

  private generateSlug(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  onFileSelect(event: Event, type: 'logo' | 'cover'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'El archivo excede el tamaño máximo de 5MB';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'logo') {
        this.logoPreview = reader.result as string;
      } else {
        this.coverPreview = reader.result as string;
      }
    };
    reader.readAsDataURL(file);

    // Upload file
    this.isUploading = true;
    const folder = type === 'logo' ? 'logos' : 'covers';

    this.uploadService.upload(file, folder).subscribe({
      next: (result) => {
        this.isUploading = false;
        if (type === 'logo') {
          this.logoUrl = result.url;
        } else {
          this.coverUrl = result.url;
        }
      },
      error: () => {
        this.isUploading = false;
        this.errorMessage = 'Error al subir la imagen';
        if (type === 'logo') {
          this.logoPreview = null;
        } else {
          this.coverPreview = null;
        }
      }
    });
  }

  loadBusiness(): void {
    if (!this.businessId) return;

    this.businessService.getById(this.businessId).subscribe({
      next: (response) => {
        if (response.data) {
          this.businessForm.patchValue(response.data);
          if (response.data.logo_url) {
            this.logoPreview = response.data.logo_url;
            this.logoUrl = response.data.logo_url;
          }
          if (response.data.cover_url) {
            this.coverPreview = response.data.cover_url;
            this.coverUrl = response.data.cover_url;
          }
        }
      }
    });
  }

  onSubmit(): void {
    if (this.businessForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const formData = {
      ...this.businessForm.value,
      logo_url: this.logoUrl,
      cover_url: this.coverUrl,
    };

    const request = this.isEditing
      ? this.businessService.update(this.businessId!, formData)
      : this.businessService.create(formData);

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
