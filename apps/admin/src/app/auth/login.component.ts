import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
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
            Iniciar sesión
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            ¿No tienes una cuenta?
            <a routerLink="/register" class="font-medium text-brand hover:text-brand-dark">
              Regístrate gratis
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="email" class="label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input-field"
                placeholder="tu@email.com"
              />
              @if (loginForm.get('email')?.invalid && loginForm.get('email')?.touched) {
                <p class="error-text">Ingresa un correo válido</p>
              }
            </div>

            <div>
              <label for="password" class="label">Contraseña</label>
              <input
                id="password"
                type="password"
                formControlName="password"
                class="input-field"
                placeholder="••••••••"
              />
              @if (loginForm.get('password')?.invalid && loginForm.get('password')?.touched) {
                <p class="error-text">La contraseña es requerida</p>
              }
            </div>

            <div class="text-right">
              <a routerLink="/forgot-password" class="text-sm text-brand hover:text-brand-dark">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }

          <button
            type="submit"
            [disabled]="loginForm.invalid || isLoading"
            class="w-full btn-primary py-3 text-lg"
          >
            @if (isLoading) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </span>
            } @else {
              Iniciar sesión
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}
