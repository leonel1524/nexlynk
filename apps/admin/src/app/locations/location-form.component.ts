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

          <!-- Google Maps URL -->
          <div>
            <label for="mapsUrl" class="label">Enlace de Google Maps</label>
            <div class="flex items-center gap-2">
              <input
                id="mapsUrl"
                type="url"
                formControlName="mapsUrl"
                class="input-field flex-1"
                placeholder="https://www.google.com/maps/place/..."
                (blur)="parseGoogleMapsUrl()"
              />
              <button
                type="button"
                (click)="parseGoogleMapsUrl()"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Detectar
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Pega un enlace de Google Maps para auto-completar las coordenadas</p>
            @if (mapsParsed) {
              <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                Coordenadas detectadas
              </p>
            }
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
  mapsParsed = false;
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
      mapsUrl: [''],
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

  parseGoogleMapsUrl(): void {
    const url = this.locationForm.get('mapsUrl')?.value;
    if (!url) return;

    const coords = this.extractCoordinatesFromGoogleMapsUrl(url);
    if (coords) {
      this.locationForm.patchValue({
        latitude: coords.lat,
        longitude: coords.lng
      });
      this.mapsParsed = true;
    }
  }

  private extractCoordinatesFromGoogleMapsUrl(url: string): { lat: number; lng: number } | null {
    // Pattern 1: @lat,lng,zoomz (most common share format)
    // e.g., https://www.google.com/maps/place/.../@10.4806,-66.9036,15z
    const atPattern = /@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const atMatch = url.match(atPattern);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }

    // Pattern 2: q=lat,lng (direct coordinate search)
    // e.g., https://www.google.com/maps?q=10.4806,-66.9036
    const qPattern = /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const qMatch = url.match(qPattern);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }

    // Pattern 3: !2d and !3d (embedded format)
    // e.g., https://www.google.com/maps/place/.../data=!3d10.4806!2d-66.9036
    const exPattern = /!3d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/;
    const exMatch = url.match(exPattern);
    if (exMatch) {
      return { lat: parseFloat(exMatch[1]), lng: parseFloat(exMatch[2]) };
    }

    // Pattern 4: /maps/@lat,lng (shorter format)
    const mapsPattern = /maps\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/;
    const mapsMatch = url.match(mapsPattern);
    if (mapsMatch) {
      return { lat: parseFloat(mapsMatch[1]), lng: parseFloat(mapsMatch[2]) };
    }

    return null;
  }

  onSubmit(): void {
    if (this.locationForm.invalid) return;

    this.isLoading = true;

    const formValue = { ...this.locationForm.value };
    // Remove mapsUrl before sending to API
    delete formValue.mapsUrl;

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
