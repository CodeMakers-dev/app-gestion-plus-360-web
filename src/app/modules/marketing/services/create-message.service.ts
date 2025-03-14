import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface MensajeMasivoRequest {
    mensajeMasivo: any;  // Aquí puedes definir una interfaz con los campos esperados
    archivos: any[];
    botones: any[];
  }
  

@Injectable({
  providedIn: 'root'
})
export class CreateMessageService {
  private apiUrl = 'http://localhost:8080/api/v1/MensajeMasivo'; // Reemplaza con tu URL real

  constructor(private http: HttpClient) {}

  sendMensajeMasivo(request: MensajeMasivoRequest, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, request, { headers });
  }
}
