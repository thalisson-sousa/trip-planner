import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }
}
