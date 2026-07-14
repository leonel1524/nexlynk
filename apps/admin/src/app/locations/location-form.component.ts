import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { Location, DAYS_OF_WEEK } from '@nexlynk/shared';

@Component({
  selector: 'app-location-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="max-w-2xl mx-auto">
      <div class="mb-6">
        <a [routerLink]="['/businesses', businessId, 'locations']" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver a ubicaciones
        </a>
      </div>

      <div class="card">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">
          {{ isEditing ? 'Editar ubicación' : 'Nueva ubicación' }}
        </h1>

        <form [formGroup]="locationForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label for="name" class="label">Nombre de la ubicación *</label>
            <input
              id="name"
              type="text"
              formControlName="name"
              class="input-field"
              placeholder="Sede Principal"
            />
            @if (locationForm.get('name')?.invalid && locationForm.get('name')?.touched) {
              <p class="error-text">El nombre es requerido</p>
            }
          </div>

          <div>
            <label for="address" class="label">Dirección *</label>
            <input
              id="address"
              type="text"
              formControlName="address"
              class="input-field"
              placeholder="Av. Principal, Caracas"
            />
            @if (locationForm.get('address')?.invalid && locationForm.get('address')?.touched) {
              <p class="error-text">La dirección es requerida</p>
            }
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="latitude" class="label">Latitud</label>
              <input
                id="latitude"
                type="number"
                formControlName="latitude"
                class="input-field"
                placeholder="10.4806"
                step="any"
              />
            </div>

            <div>
              <label for="longitude" class="label">Longitud</label>
              <input
                id="longitude"
                type="number"
                formControlName="longitude"
                class="input-field"
                placeholder="-66.9036"
                step="any"
              />
            </div>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_main"
              formControlName="is_main"
              class="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand"
            />
            <label for="is_main" class="text-sm text-gray-700">
              Establecer como ubicación principal
            </label>
          </div>

          <!-- Schedule -->
          <div>
            <label class="label mb-3">Horario</label>
            <div class="space-y-3" formGroupName="schedule">
              @for (day of daysOfWeek; track day) {
                <div class="flex items-center gap-4">
                  <span class="w-24 text-sm text-gray-700 capitalize">{{ day }}</span>
                  <input
                    [formControlName]="day"
                    type="text"
                    class="input-field flex-1"
                    placeholder="8am - 6pm"
                  />
                </div>
              }
            </div>
          </div>

          <div class="flex items-center gap-4 pt-4">
            <button type="submit" [disabled]="locationForm.invalid || isLoading" class="btn-primary">
              {{ isEditing ? 'Guardar cambios' : 'Crear ubicación' }}
            </button>
            <a [routerLink]="['/businesses', businessId, 'locations']" class="btn-ghost">Cancelar</a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class LocationFormComponent implements OnInit {
  locationForm: FormGroup;
  businessId: string = '';
  locationId: string | null = null;
  isEditing = false;
  isLoading = false;
  daysOfWeek = DAYS_OF_WEEK;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const scheduleControls: Record<string, any> = {};
    DAYS_OF_WEEK.forEach(day => {
      scheduleControls[day] = [''];
    });

    this.locationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: [''],
      whatsapp: [''],
      latitude: [null],
      longitude: [null],
      is_main: [false],
      schedule: this.fb.group(scheduleControls)
    });
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    this.locationId = this.route.snapshot.paramMap.get('locationId');
    
    if (this.locationId) {
      this.isEditing = true;
    }
  }

  onSubmit(): void {
    if (this.locationForm.invalid) return;

    this.isLoading = true;

    const formValue = { ...this.locationForm.value };
    // Convert schedule object to proper format
    const schedule: Record<string, string> = {};
    Object.entries(formValue.schedule).forEach(([day, value]) => {
      if (value) {
        schedule[day] = value as string;
      }
    });
    formValue.schedule = schedule;

    const request = this.isEditing
      ? this.businessService.updateLocation(this.businessId, this.locationId!, formValue)
      : this.businessService.createLocation(this.businessId, formValue);

    request.subscribe({
      next: () => {
        this.router.navigate(['/businesses', this.businessId, 'locations']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
