import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, AuthTokens, LoginRequest, RegisterRequest } from '@nexlynk/shared';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokensSubject = new BehaviorSubject<AuthTokens | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();
  tokens$ = this.tokensSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadFromStorage();
  }

  get isAuthenticated(): boolean {
    return !!this.tokensSubject.value;
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginRequest): Observable<{ user: User; tokens: AuthTokens }> {
    return this.http.post<{ user: User; tokens: AuthTokens }>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.tokensSubject.next(response.tokens);
          this.saveToStorage(response.user, response.tokens);
        })
      );
  }

  register(data: RegisterRequest): Observable<{ user: User; tokens: AuthTokens }> {
    return this.http.post<{ user: User; tokens: AuthTokens }>(`${this.API_URL}/register`, data)
      .pipe(
        tap(response => {
          this.currentUserSubject.next(response.user);
          this.tokensSubject.next(response.tokens);
          this.saveToStorage(response.user, response.tokens);
        })
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.tokensSubject.next(null);
    localStorage.removeItem('nexlynk_user');
    localStorage.removeItem('nexlynk_tokens');
  }

  private saveToStorage(user: User, tokens: AuthTokens): void {
    localStorage.setItem('nexlynk_user', JSON.stringify(user));
    localStorage.setItem('nexlynk_tokens', JSON.stringify(tokens));
  }

  private loadFromStorage(): void {
    const userStr = localStorage.getItem('nexlynk_user');
    const tokensStr = localStorage.getItem('nexlynk_tokens');

    if (userStr && tokensStr) {
      try {
        const user = JSON.parse(userStr);
        const tokens = JSON.parse(tokensStr);
        this.currentUserSubject.next(user);
        this.tokensSubject.next(tokens);
      } catch {
        this.logout();
      }
    }
  }
}
