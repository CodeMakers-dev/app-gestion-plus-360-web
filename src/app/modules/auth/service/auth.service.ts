import { ApiResponse } from '@core/interfaces/Iresponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/Usuario/validar';

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, password: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, { usuario, password }).pipe(
      tap((response: ApiResponse) => {
        if (response.success) {
          localStorage.setItem('token', response.response.token);
          this.router.navigate(['/home']);
        }
      }));
  }

  logout(): void {
    // Elimina el token de localStorage
    localStorage.removeItem('token');
    // Limpia sessionStorage
    sessionStorage.clear();
    // Redirige al login
    this.router.navigate(['/login']);
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
