import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@nexlynk/shared';
import { environment } from '../../../environments/environment';

export interface AnalyticsSummary {
  total_views: number;
  total_whatsapp_clicks: number;
  total_maps_clicks: number;
  total_phone_clicks: number;
  total_menu_views: number;
  recent_events: any[];
}

export interface DashboardStats {
  views: number;
  clicks: number;
  orders: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly API_URL = `${environment.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getBusinessAnalytics(businessId: string, days = 30): Observable<ApiResponse<AnalyticsSummary>> {
    return this.http.get<ApiResponse<AnalyticsSummary>>(`${this.API_URL}/business/${businessId}`, {
      params: { days: days.toString() }
    });
  }

  getDashboardStats(businessId: string): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.API_URL}/business/${businessId}/stats`);
  }
}
