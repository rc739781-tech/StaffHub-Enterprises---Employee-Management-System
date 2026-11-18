import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../models/api-response.model';
import { AuthResponse, LoginRequest } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private userSignal = signal<AuthResponse | null>(null);

  currentUser = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.userSignal()?.token);

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const savedUser = localStorage.getItem('emp_auth_user');
    if (savedUser) {
      try {
        const parsed: AuthResponse = JSON.parse(savedUser);
        // Check expiration
        if (new Date(parsed.expiresAt) > new Date()) {
          this.userSignal.set(parsed);
        } else {
          this.logout();
        }
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          localStorage.setItem('emp_auth_user', JSON.stringify(response.data));
          localStorage.setItem('emp_auth_token', response.data.token);
          this.userSignal.set(response.data);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('emp_auth_user');
    localStorage.removeItem('emp_auth_token');
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('emp_auth_token');
  }
}
