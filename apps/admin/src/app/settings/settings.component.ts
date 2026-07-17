import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { STORAGE_KEYS } from '@nexlynk/shared';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Configuración</h1>

      <!-- Profile Section -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Perfil</h2>
        <form [formGroup]="profileForm" (ngSubmit)="updateProfile()" class="space-y-4">
          <div>
            <label for="name" class="label">Nombre</label>
            <input id="name" type="text" formControlName="name" class="input-field" />
          </div>
          <div>
            <label for="phone" class="label">Teléfono</label>
            <input id="phone" type="tel" formControlName="phone" class="input-field" placeholder="+58 412 1234567" />
          </div>
          <          <div>
            <label for="website" class="label">Sitio web</label>
            <input id="website" type="url" formControlName="website" class="input-field" placeholder="https://minegocio.com" />
          </div>

          @if (profileMessage) {
            <div [class]="profileSuccess ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'" class="px-4 py-3 rounded-lg text-sm">
              {{ profileMessage }}
            </div>
          }

          <button type="submit" [disabled]="profileForm.invalid || isProfileLoading" class="btn-primary">
            {{ isProfileLoading ? 'Guardando...' : 'Guardar perfil' }}
          </button>
        </form>
      </div>

      <!-- Change Password Section -->
      <div class="card mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Cambiar contraseña</h2>
        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
          <div>
            <label for="currentPassword" class="label">Contraseña actual</label>
            <input id="currentPassword" type="password" formControlName="currentPassword" class="input-field" />
          </div>
          <div>
            <label for="newPassword" class="label">Nueva contraseña</label>
            <input id="newPassword" type="password" formControlName="newPassword" class="input-field" />
            @if (passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched) {
              <p class="error-text">Mínimo 8 caracteres</p>
            }
          </div>
          <div>
            <label for="confirmPassword" class="label">Confirmar contraseña</label>
            <input id="confirmPassword" type="password" formControlName="confirmPassword" class="input-field" />
            @if (passwordForm.get('confirmPassword')?.touched && passwordForm.get('confirmPassword')?.value !== passwordForm.get('newPassword')?.value) {
              <p class="error-text">Las contraseñas no coinciden</p>
            }
          </div>

          @if (passwordMessage) {
            <div [class]="passwordSuccess ? 'bg-green-50 border border-green-200 text-green-600' : 'bg-red-50 border border-red-200 text-red-600'" class="px-4 py-3 rounded-lg text-sm">
              {{ passwordMessage }}
            </div>
          }

          <button type="submit" [disabled]="passwordForm.invalid || isPasswordLoading || passwordForm.get('confirmPassword')?.value !== passwordForm.get('newPassword')?.value" class="btn-primary">
            {{ isPasswordLoading ? 'Cambiando...' : 'Cambiar contraseña' }}
          </button>
        </form>
      </div>

      <!-- Account Info -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Cuenta</h2>
        <div class="space-y-2 text-sm">
          <p><span class="font-medium text-gray-700">Correo:</span> {{ userEmail }}</p>
          <p><span class="font-medium text-gray-700">Plan:</span> {{ userPlan }}</p>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  isProfileLoading = false;
  isPasswordLoading = false;
  profileMessage = '';
  profileSuccess = false;
  passwordMessage = '';
  passwordSuccess = false;
  userEmail = '';
  userPlan = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
  ) {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      website: [''],
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.userEmail = user.email || '';
      this.userPlan = user.plan || 'free';
      this.loadProfile(user.id);
    }
  }

  loadProfile(userId: string): void {
    const token = localStorage.getItem(STORAGE_KEYS.tokens);
    const tokens = token ? JSON.parse(token) : null;

    this.http.get<any>(`${environment.apiUrl}/auth/profile`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${tokens?.access_token}` })
    }).subscribe({
      next: (data) => {
        this.profileForm.patchValue({
          name: data.name || '',
          phone: data.phone || '',
          website: data.website || '',
        });
      }
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) return;

    this.isProfileLoading = true;
    this.profileMessage = '';

    const token = localStorage.getItem(STORAGE_KEYS.tokens);
    const tokens = token ? JSON.parse(token) : null;

    this.http.patch<any>(`${environment.apiUrl}/auth/profile`, this.profileForm.value, {
      headers: new HttpHeaders({ Authorization: `Bearer ${tokens?.access_token}` })
    }).subscribe({
      next: () => {
        this.isProfileLoading = false;
        this.profileSuccess = true;
        this.profileMessage = 'Perfil actualizado correctamente';
      },
      error: (error) => {
        this.isProfileLoading = false;
        this.profileSuccess = false;
        this.profileMessage = error.error?.message || 'Error al actualizar el perfil';
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isPasswordLoading = true;
    this.passwordMessage = '';

    const token = localStorage.getItem(STORAGE_KEYS.tokens);
    const tokens = token ? JSON.parse(token) : null;

    this.http.post<any>(`${environment.apiUrl}/auth/change-password`, {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword,
    }, {
      headers: new HttpHeaders({ Authorization: `Bearer ${tokens?.access_token}` })
    }).subscribe({
      next: () => {
        this.isPasswordLoading = false;
        this.passwordSuccess = true;
        this.passwordMessage = 'Contraseña cambiada correctamente';
        this.passwordForm.reset();
      },
      error: (error) => {
        this.isPasswordLoading = false;
        this.passwordSuccess = false;
        this.passwordMessage = error.error?.message || 'Error al cambiar la contraseña';
      }
    });
  }
}
