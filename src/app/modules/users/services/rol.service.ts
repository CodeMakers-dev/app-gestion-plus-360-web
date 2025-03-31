import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { IRol } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private apiUrl = 'http://localhost:8080/api/v1/Rol/all';

  constructor(private http: HttpClient) {}

  getRol(): Observable<ApiResponse<IRol[]>> {
    return this.http.get<ApiResponse<IRol[]>>(this.apiUrl);
  }
}