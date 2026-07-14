import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Business, Menu, Location, ApiResponse, PaginatedResponse } from '@nexlynk/shared';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private readonly API_URL = '/api/businesses';

  constructor(private http: HttpClient) {}

  getAll(page = 1, limit = 10): Observable<PaginatedResponse<Business>> {
    return this.http.get<PaginatedResponse<Business>>(this.API_URL, {
      params: { page: page.toString(), limit: limit.toString() }
    });
  }

  getById(id: string): Observable<ApiResponse<Business>> {
    return this.http.get<ApiResponse<Business>>(`${this.API_URL}/${id}`);
  }

  create(business: Partial<Business>): Observable<ApiResponse<Business>> {
    return this.http.post<ApiResponse<Business>>(this.API_URL, business);
  }

  update(id: string, business: Partial<Business>): Observable<ApiResponse<Business>> {
    return this.http.put<ApiResponse<Business>>(`${this.API_URL}/${id}`, business);
  }

  delete(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  // Menus
  getMenus(businessId: string): Observable<ApiResponse<Menu[]>> {
    return this.http.get<ApiResponse<Menu[]>>(`${this.API_URL}/${businessId}/menus`);
  }

  createMenu(businessId: string, menu: Partial<Menu>): Observable<ApiResponse<Menu>> {
    return this.http.post<ApiResponse<Menu>>(`${this.API_URL}/${businessId}/menus`, menu);
  }

  updateMenu(businessId: string, menuId: string, menu: Partial<Menu>): Observable<ApiResponse<Menu>> {
    return this.http.put<ApiResponse<Menu>>(`${this.API_URL}/${businessId}/menus/${menuId}`, menu);
  }

  deleteMenu(businessId: string, menuId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${businessId}/menus/${menuId}`);
  }

  // Locations
  getLocations(businessId: string): Observable<ApiResponse<Location[]>> {
    return this.http.get<ApiResponse<Location[]>>(`${this.API_URL}/${businessId}/locations`);
  }

  createLocation(businessId: string, location: Partial<Location>): Observable<ApiResponse<Location>> {
    return this.http.post<ApiResponse<Location>>(`${this.API_URL}/${businessId}/locations`, location);
  }

  updateLocation(businessId: string, locationId: string, location: Partial<Location>): Observable<ApiResponse<Location>> {
    return this.http.put<ApiResponse<Location>>(`${this.API_URL}/${businessId}/locations/${locationId}`, location);
  }

  deleteLocation(businessId: string, locationId: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${businessId}/locations/${locationId}`);
  }
}
