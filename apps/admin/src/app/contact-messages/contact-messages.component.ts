import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BusinessService } from '../shared/services/business.service';
import { ContactService } from '../shared/services/contact.service';
import { Business, ContactMessage } from '@nexlynk/shared';

@Component({
  selector: 'app-contact-messages',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <a [routerLink]="['/businesses', businessId]" class="text-brand hover:text-brand-dark text-sm font-medium flex items-center gap-1 mb-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Volver al negocio
          </a>
          <h1 class="text-2xl font-bold text-gray-900">Mensajes de contacto</h1>
          <p class="text-gray-600">{{ business?.name }}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 text-sm font-medium bg-brand/10 text-brand rounded-full">
            {{ unreadCount }} sin leer
          </span>
        </div>
      </div>

      @if (loading) {
        <div class="card text-center py-12">
          <div class="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-gray-500">Cargando mensajes...</p>
        </div>
      } @else if (messages.length === 0) {
        <div class="card text-center py-12">
          <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
          </svg>
          <p class="text-gray-500">No hay mensajes de contacto</p>
        </div>
      } @else {
        <div class="space-y-4">
          @for (message of messages; track message.id) {
            <div class="card" [class]="!message.is_read ? 'ring-2 ring-brand/30' : ''">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div class="w-10 h-10 bg-brand/10 rounded-full flex items-center justify-center">
                      <span class="text-brand font-medium">{{ message.name.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-medium text-gray-900">{{ message.name }}</h3>
                        @if (!message.is_read) {
                          <span class="w-2 h-2 bg-brand rounded-full"></span>
                        }
                      </div>
                      <p class="text-sm text-gray-500">{{ message.email }}</p>
                    </div>
                  </div>
                  
                  <p class="text-gray-700 mb-3 ml-13">{{ message.message }}</p>
                  
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span>{{ formatDate(message.created_at) }}</span>
                    @if (message.phone) {
                      <a [href]="'tel:' + message.phone" class="text-brand hover:underline">
                        {{ message.phone }}
                      </a>
                    }
                  </div>
                </div>
                
                @if (!message.is_read) {
                  <button (click)="markAsRead(message)" class="text-brand hover:text-brand-dark text-sm font-medium ml-4">
                    Marcar como leído
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class ContactMessagesComponent implements OnInit {
  businessId = '';
  business: Business | null = null;
  messages: ContactMessage[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private contactService: ContactService
  ) {}

  get unreadCount(): number {
    return this.messages.filter(m => !m.is_read).length;
  }

  ngOnInit(): void {
    this.businessId = this.route.snapshot.paramMap.get('id') || '';
    if (this.businessId) {
      this.loadBusiness();
      this.loadMessages();
    }
  }

  loadBusiness(): void {
    this.businessService.getById(this.businessId).subscribe({
      next: (response) => {
        this.business = response.data || null;
      }
    });
  }

  loadMessages(): void {
    this.loading = true;
    this.contactService.getMessages(this.businessId).subscribe({
      next: (response) => {
        this.messages = response.data || [];
        this.loading = false;
      },
      error: () => {
        this.messages = [];
        this.loading = false;
      }
    });
  }

  markAsRead(message: ContactMessage): void {
    this.contactService.markAsRead(this.businessId, message.id).subscribe({
      next: () => {
        message.is_read = true;
      }
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
