import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <div class="flex justify-center">
            <div class="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center">
              <span class="text-white font-bold text-3xl">N</span>
            </div>
          </div>
          <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
            Crea tu cuenta
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <a routerLink="/login" class="font-medium text-brand hover:text-brand-dark">
              Inicia sesión
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="name" class="label">Nombre completo</label>
              <input
                id="name"
                type="text"
                formControlName="name"
                class="input-field"
                placeholder="Tu nombre"
              />
              @if (registerForm.get('name')?.invalid && registerForm.get('name')?.touched) {
                <p class="error-text">El nombre es requerido</p>
              }
            </div>

            <div>
              <label for="email" class="label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input-field"
                placeholder="tu@email.com"
              />
              @if (registerForm.get('email')?.invalid && registerForm.get('email')?.touched) {
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
                placeholder="Mínimo 8 caracteres"
              />
              @if (registerForm.get('password')?.invalid && registerForm.get('password')?.touched) {
                <p class="error-text">La contraseña debe tener al menos 8 caracteres</p>
              }
            </div>

            <div>
              <label for="businessName" class="label">Nombre de tu negocio (opcional)</label>
              <input
                id="businessName"
                type="text"
                formControlName="businessName"
                class="input-field"
                placeholder="Mi Negocio"
              />
            </div>
          </div>

          @if (errorMessage) {
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage }}
            </div>
          }

          <button
            type="submit"
            [disabled]="registerForm.invalid || isLoading"
            class="w-full btn-primary py-3 text-lg"
          >
            @if (isLoading) {
              <span class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando cuenta...
              </span>
            } @else {
              Crear cuenta gratis
            }
          </button>
        </form>
      </div>
    </div>
  `
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      businessName: ['']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Error al crear la cuenta';
      }
    });
  }
}
