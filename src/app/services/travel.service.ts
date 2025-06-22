import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TravelService {

  private readonly apiUrl = `${environment.API}/travel`;

  constructor(private http: HttpClient) { }

  newTravel(travel: any) {
    return this.http.post(this.apiUrl, travel);
  }
}
