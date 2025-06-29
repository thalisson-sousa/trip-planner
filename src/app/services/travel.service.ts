import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TravelService {
  private readonly apiUrl = `${environment.API}/travel`;
  private AuthToken =
    localStorage.getItem('token')?.replace('Bearer ', '') || '';

  constructor(private http: HttpClient) {}

  newTravel(travel: any) {

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthToken}`,
      'Content-Type': 'application/json',
    });

    return this.http.post(this.apiUrl, travel, { headers });
  }
}
