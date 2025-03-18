 import { HttpClient } from "@angular/common/http";
 import { Injectable } from "@angular/core";
 import { IOrigenPago, ITipoPlan } from "@core/interfaces/Ipayments";
 import { ApiResponse } from "@core/interfaces/Iresponse";
 import { Observable } from "rxjs";
 
 @Injectable({
   providedIn: 'root',
 })
 export class OriginPaymentService {
   private apiUrl = 'http://localhost:8080/api/v1/OrigenPago/all';
 
   constructor(private http: HttpClient) {}
 
   getAllOriginPayment(): Observable<ApiResponse<IOrigenPago[]>> {
     return this.http.get<ApiResponse<IOrigenPago[]>>(this.apiUrl);
   }
 }