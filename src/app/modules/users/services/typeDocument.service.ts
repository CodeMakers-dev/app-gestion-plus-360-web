import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { ITipoDocumento } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TypeDocumentService {
  private apiUrl = 'http://localhost:8080/api/v1/TipoDocumento/all';

  constructor(private http: HttpClient) {}

  getAllTypeDocument(): Observable<ApiResponse<ITipoDocumento[]>> {
    return this.http.get<ApiResponse<ITipoDocumento[]>>(this.apiUrl);
  }
}