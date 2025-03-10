import { ApiResponse } from '@core/interfaces/Iresponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Iuser } from '@core/interfaces/Iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/Usuario/validar';

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, password: string): Observable<ApiResponse<Iuser>> {
    return this.http.post<ApiResponse<Iuser>>(this.apiUrl, { usuario, password }).pipe(
      tap((response: ApiResponse<Iuser>) => {
        console.log('Response:', response.response.id);
        if (response.code === 200) {
          console.log('Ingreso a el sucess')
          localStorage.setItem('token', response.response.token);
          localStorage.setItem('userId', response.response.id);
          this.router.navigate(['/home']);
        }
      }));
  }

  logout(): void {
    // Elimina el token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    // Limpia sessionStorage
    sessionStorage.clear();
    // Redirige al login
    this.router.navigate(['/login']);
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  recoverPassword(usuario: string): Observable<ApiResponse<any>> {
    const url = `http://localhost:8080/api/v1/Usuario/recover-password?usuario=${encodeURIComponent(usuario)}`;
    return this.http.post<ApiResponse<any>>(url, {}).pipe(
      tap((response: ApiResponse<any>) => {
        console.log('Recuperación de contraseña:', response);
        alert('Correo de recuperación enviado.');
      })
    );
  }
}
