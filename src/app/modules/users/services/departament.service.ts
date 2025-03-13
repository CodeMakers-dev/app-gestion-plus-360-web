import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { IDepartamento } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class DepartamentService {
  private apiUrl = 'http://localhost:8080/api/v1/Departamento/all';

  constructor(private http: HttpClient) {}

  getAllDepartament(): Observable<ApiResponse<IDepartamento[]>> {
    return this.http.get<ApiResponse<IDepartamento[]>>(this.apiUrl);
  }
}