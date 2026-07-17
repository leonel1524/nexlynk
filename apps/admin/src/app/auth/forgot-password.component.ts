import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
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
            Recuperar contraseña
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        @if (!emailSent) {
          <form class="mt-8 space-y-6" [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
            <div>
              <label for="email" class="label">Correo electrónico</label>
              <input
                id="email"
                type="email"
                formControlName="email"
                class="input-field"
                placeholder="tu@email.com"
              />
              @if (forgotForm.get('email')?.invalid && forgotForm.get('email')?.touched) {
                <p class="error-text">Ingresa un correo válido</p>
              }
            </div>

            @if (errorMessage) {
              <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {{ errorMessage }}
              </div>
            }

            <button
              type="submit"
              [disabled]="forgotForm.invalid || isLoading"
              class="w-full btn-primary py-3 text-lg"
            >
              @if (isLoading) {
                <span class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              } @else {
                Enviar enlace de recuperación
              }
            </button>
          </form>
        } @else {
          <div class="mt-8 text-center">
            <div class="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
              Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
            </div>
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
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>(`${environment.apiUrl}/auth/forgot-password`, this.forgotForm.value)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.emailSent = true;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al enviar el correo';
        }
      });
  }
}
