import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { ICiudad } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private apiUrl = 'http://localhost:8080/api/v1/Ciudad/all';

  constructor(private http: HttpClient) {}

  getCity(): Observable<ApiResponse<ICiudad[]>> {
    return this.http.get<ApiResponse<ICiudad[]>>(this.apiUrl);
  }
}
