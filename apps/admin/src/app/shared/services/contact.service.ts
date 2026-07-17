import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, ContactMessage } from '@nexlynk/shared';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly API_URL = `${environment.apiUrl}/businesses`;

  constructor(private http: HttpClient) {}

  getMessages(businessId: string): Observable<ApiResponse<ContactMessage[]>> {
    return this.http.get<ApiResponse<ContactMessage[]>>(`${this.API_URL}/${businessId}/contact`);
  }

  markAsRead(businessId: string, messageId: string): Observable<ApiResponse<ContactMessage>> {
    return this.http.patch<ApiResponse<ContactMessage>>(`${this.API_URL}/${businessId}/contact/${messageId}/read`);
  }
}
