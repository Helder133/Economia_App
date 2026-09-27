import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumenPortafolioRespuesta } from '../models/portafolio.model';

@Injectable({
  providedIn: 'root',
})
export class PortafolioService {
  private apiUrl = 'http://localhost:3000/api/v1/portafolio/resumen'; 

  constructor(private http: HttpClient) {}

  calcularResumen(payload: any): Observable<ResumenPortafolioRespuesta> {
    return this.http.post<ResumenPortafolioRespuesta>(this.apiUrl, payload);
  }
}
