import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.API}/api/auth`;
  private isvalid: Boolean = false;

  constructor(private http: HttpClient) {}

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  validateToken(): Observable<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(false);
    }

    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/validate`, {
      headers: { Authorization: `Bearer ${token}` }
    }).pipe(
      map(res => res.valid),
      catchError(() => of(false)) // qualquer erro = token inválido
    );
  }
}
