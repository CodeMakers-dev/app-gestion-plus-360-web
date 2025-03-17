import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { IPersona, IPersonCreate } from '@core/interfaces/IuserById';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private apiUrl = 'http://localhost:8080/api/v1/Persona/all';

  constructor(private http: HttpClient) {}

  getPersons(): Observable<ApiResponse<IPersona[]>> {
    return this.http.get<ApiResponse<IPersona[]>>(this.apiUrl);
  }

  createPersona(persona: IPersonCreate): Observable<ApiResponse<IPersona>> {
    return this.http.post<ApiResponse<IPersona>>("http://localhost:8080/api/v1/Persona", persona);
  }
}
