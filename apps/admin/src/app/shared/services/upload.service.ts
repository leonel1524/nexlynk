import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '@nexlynk/shared';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private readonly API_URL = `${environment.apiUrl}/upload`;

  constructor(private http: HttpClient) {}

  upload(file: File, folder: string = 'uploads'): Observable<{ url: string; path: string }> {
    const token = localStorage.getItem(STORAGE_KEYS.tokens);
    const tokens = token ? JSON.parse(token) : null;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<{ url: string; path: string }>(this.API_URL, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${tokens?.access_token}`,
      }),
    });
  }
}
