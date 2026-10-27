import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResumenPortafolioRespuesta } from '../models/portafolio.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PortafolioService {
  private apiUrl = `${environment.apiUrl}/portafolio/resumen`;

  constructor(private http: HttpClient) {}

  calcularResumen(payload: any): Observable<ResumenPortafolioRespuesta> {
    return this.http.post<ResumenPortafolioRespuesta>(this.apiUrl, payload);
  }
}
