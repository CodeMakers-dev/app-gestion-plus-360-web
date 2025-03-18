import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ITipoPlan } from "@core/interfaces/Ipayments";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TypePlanService {
  private apiUrl = 'http://localhost:8080/api/v1/TipoPlan/all';

  constructor(private http: HttpClient) {}

  getAllTypePlan(): Observable<ApiResponse<ITipoPlan[]>> {
    return this.http.get<ApiResponse<ITipoPlan[]>>(this.apiUrl);
  }
}