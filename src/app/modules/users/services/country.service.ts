import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { IPais } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'http://localhost:8080/api/v1/Pais/all';

  constructor(private http: HttpClient) {}

  getAllCountry(): Observable<ApiResponse<IPais[]>> {
    return this.http.get<ApiResponse<IPais[]>>(this.apiUrl);
  }
}