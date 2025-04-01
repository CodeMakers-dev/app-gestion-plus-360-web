import { ApiResponse } from '@core/interfaces/Iresponse';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { Iuser } from '@core/interfaces/Iuser';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/v1/Usuario/validar';
  private profileImageUrl: string | null = null;
  private roleUrl = 'http://localhost:8080/api/v1/Usuario/';

  constructor(private http: HttpClient, private router: Router) { }

  login(usuario: string, password: string): Observable<ApiResponse<Iuser>> {
    return this.http.post<ApiResponse<Iuser>>(this.apiUrl, { usuario, password }).pipe(
      mergeMap((response: ApiResponse<Iuser>) => {
        if (response.code === 200) {
          localStorage.setItem('token', response.response.token);
          localStorage.setItem('userId', response.response.id.toString());
          //localStorage.setItem('profileImageUrl', response.response.persona?.imagen || '');
          return this.getRole(Number(response.response.id)).pipe(
            tap(role => {
              console.log('User role:', role);
              localStorage.setItem('userRole', role.trim());
              this.router.navigate(['/home']);
            }),
            mergeMap(() => of(response))
          );
        } else {
          return of(response);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('profileImageUrl');
    sessionStorage.clear();
  
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }


  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  setProfileImageUrl(url: string | null) {
    this.profileImageUrl = url;
  }
  
  getProfileImageUrl(): string | null {
    return this.profileImageUrl;
  }  

  getUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getRole(userId: number): Observable<string> {
    return this.http.get<ApiResponse<any>>(`${this.roleUrl}${userId}`).pipe(
      map(response => response.response.rol.nombre)
    );
  }

  recoverPassword(usuario: string): Observable<ApiResponse<any>> {
    const url = `http://localhost:8080/api/v1/Usuario/recover-password?usuario=${encodeURIComponent(usuario)}`;
    return this.http.post<ApiResponse<any>>(url, {}).pipe(
      tap((response: ApiResponse<any>) => {
      })
    );
  }
}
