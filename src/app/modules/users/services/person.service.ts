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

  constructor(private http: HttpClient) { }

  getPersons(): Observable<ApiResponse<IPersona[]>> {
    return this.http.get<ApiResponse<IPersona[]>>(this.apiUrl);
  }

  getPersonById(id: number): Observable<ApiResponse<IPersona>> {
    return this.http.get<ApiResponse<IPersona>>(`${"http://localhost:8080/api/v1/Persona"}/${id}`)
  }

  createPersona(persona: IPersonCreate): Observable<ApiResponse<IPersona>> {
    return this.http.post<ApiResponse<IPersona>>("http://localhost:8080/api/v1/Persona", persona);
  }

  updateUser(id: number, userData: IPersonCreate): Observable<ApiResponse<IPersona>> {
    return this.http.put<ApiResponse<IPersona>>(`http://localhost:8080/api/v1/Persona/${id}`, userData);
  }

  blockPerson(id: number): Observable<ApiResponse<IPersona>> {
    return this.http.put<ApiResponse<IPersona>>(`${"http://localhost:8080/api/v1/Persona/block"}/${id}`, null);
  }

  uploadProfileImage(userId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', image, image.name);
    const url = `${"http://localhost:8080/api/v1/Persona"}/${userId}/imagen`;
    return this.http.put(url, formData);
  }

}
