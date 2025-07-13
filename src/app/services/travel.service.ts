import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Trip } from '../types/Trip';

import { gerarCorAleatoria } from '../utils/ramdomColor';

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

  getTravels(): Observable<Trip[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.AuthToken}`,
    });

    const url = `${this.apiUrl}/full`;
    return this.http.get<Trip[]>(url, { headers }).pipe(
      map((response: Trip[]) => {
        response.forEach((trip: Trip) => {
          // Gera uma cor aleatória para cada trip
          const corAleatoria = gerarCorAleatoria();
          // Define a imagem da viagem com a cor aleatória
          trip.imageUrl = trip.imageUrl || `https://placehold.co/400x200/${corAleatoria}/ffffff?text=${trip.destino}`;
        });
        return response;
      })
    );
  }

}
