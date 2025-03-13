import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { ITipoPersona } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class TypePersonService {
  private apiUrl = 'http://localhost:8080/api/v1/TipoPersona/all';

  constructor(private http: HttpClient) {}

  getTypePerson(): Observable<ApiResponse<ITipoPersona[]>> {
    return this.http.get<ApiResponse<ITipoPersona[]>>(this.apiUrl);
  }
}
