import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { IPagos } from '@core/interfaces/Ipayments';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/v1/Pago';

  constructor(private http: HttpClient) {}

  createPayment(paymentData: any): Observable<any> {
    return this.http.post(this.apiUrl, paymentData);
  }
  
  getPayments(): Observable<ApiResponse<IPagos[]>> {
      return this.http.get<ApiResponse<IPagos[]>>(`${"http://localhost:8080/api/v1/Pago"}/all`);
    }

    getPaymentById(id: number): Observable<ApiResponse<IPagos>> {
      return this.http.get<ApiResponse<IPagos>>(`${this.apiUrl}/unique/${id}`);
    }
  
    updatePayment(id: number, paymentData: Partial<IPagos>): Observable<ApiResponse<IPagos>> {
      return this.http.put<ApiResponse<IPagos>>(`${this.apiUrl}/update/${id}`, paymentData);
    }

    deletePayment(id: string): Observable<ApiResponse<void>> {
      return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/delete/${id}`);
    }
}