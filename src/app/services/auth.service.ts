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
    return this.http
      .get(`${this.apiUrl}`, {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      })
      .pipe(
        map(() => {
          this.isvalid = true;
          return true;
        }),
        catchError((error) => {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          this.isvalid = false;
          return of(false);
        })
      );
  }
}
