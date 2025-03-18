 import { HttpClient } from "@angular/common/http";
 import { Injectable } from "@angular/core";
 import { IDestinoPago, IOrigenPago, ITipoPlan } from "@core/interfaces/Ipayments";
 import { ApiResponse } from "@core/interfaces/Iresponse";
 import { Observable } from "rxjs";
 
 @Injectable({
   providedIn: 'root',
 })
 export class DestinationPaymentService {
   private apiUrl = 'http://localhost:8080/api/v1/DestinoPago/all';
 
   constructor(private http: HttpClient) {}
 
   getAllDestinationPayment(): Observable<ApiResponse<IDestinoPago[]>> {
     return this.http.get<ApiResponse<IDestinoPago[]>>(this.apiUrl);
   }
 }