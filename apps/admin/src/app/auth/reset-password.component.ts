import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="flex justify-center">
            <img src="assets/isologo.png" alt="Nexlynk" class="w-16 h-16 rounded-2xl" />
          </div>
          <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
            Restablecer contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu nueva contraseña.
          </p>
        </div>

        @if (!passwordReset) {
          <form class="mt-8 space-y-6" [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <div>
              <label for="password" class="label">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input-field"
                placeholder="••••••••"
              />
              @if (resetForm.get('password')?.invalid && resetForm.get('password')?.touched) {
                <p class="error-text">Mínimo 8 caracteres</p>
              }
            </div>

            <div>
              <label for="confirmPassword" class="label">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                class="input-field"
                placeholder="••••••••"
              />
              @if (resetForm.get('confirmPassword')?.touched && resetForm.get('confirmPassword')?.value !== resetForm.get('password')?.value) {
                <p class="error-text">Las contraseñas no coinciden</p>
              }
            </div>

            @if (errorMessage) {
              <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {{ errorMessage }}
              </div>
            }

            <button
              type="submit"
              [disabled]="resetForm.invalid || isLoading || resetForm.get('confirmPassword')?.value !== resetForm.get('password')?.value"
              class="w-full btn-primary py-3 text-lg"
            >
              @if (isLoading) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Restableciendo...
                </span>
              } @else {
                Restablecer contraseña
              }
            </button>
          </form>
        } @else {
          <div class="mt-8 text-center">
            <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
              Tu contraseña ha sido restablecida correctamente.
            </div>
            <a routerLink="/login" class="btn-primary inline-block">
              Iniciar sesión
            </a>
          </div>
        }

        <div class="text-center">
          <a routerLink="/login" class="text-sm text-brand hover:text-brand-dark font-medium">
            Volver al inicio de sesión
          </a>
        </div>
      </div>
    </div>
  `
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  passwordReset = false;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage = 'Token no válido o expirado';
    }
  }

  onSubmit(): void {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${environment.apiUrl}/auth/reset-password`, {
      password: this.resetForm.value.password,
      token: this.token,
    }).subscribe({
      next: () => {
        this.isLoading = false;
        this.passwordReset = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al restablecer la contraseña';
      }
    });
  }
}
