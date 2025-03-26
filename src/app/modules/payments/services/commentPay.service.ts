import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentPayService {
  private apiUrl = 'http://localhost:8080/api/v1/comentario';

  constructor(private http: HttpClient) {}

  saveComment(comment: any): Observable<any> {
    return this.http.post(`http://localhost:8080/api/v1/comentario/guardar`, comment);
}

  getCommmentByPay(idPago: number): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/pago/${idPago}`).pipe(
      map(response => Array.isArray(response) ? response : [response]) 
    );
}
}