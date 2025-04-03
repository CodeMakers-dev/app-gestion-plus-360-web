import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IUsuario } from "@core/interfaces/Ipayments";
import { ApiResponse } from "@core/interfaces/Iresponse";
import { IUserById } from "@core/interfaces/IuserById";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/v1/Usuario';

  constructor(private http: HttpClient) {}

  getUserById(id: number): Observable<ApiResponse<IUserById>> {
    return this.http.get<ApiResponse<IUserById>>(`${this.apiUrl}/${id}`);
  }

  updatePassword(id: number, password: string): Observable<ApiResponse<null>> {
    const body = { id, password };
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/edit-password`, body);
  }

   getUsers(): Observable<ApiResponse<IUsuario[]>> {
    return this.http.get<ApiResponse<IUsuario[]>>('http://localhost:8080/api/v1/Usuario/all');
  }

  obtenerUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getUserByPersonId(personId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/persona/${personId}`);
  }
}
