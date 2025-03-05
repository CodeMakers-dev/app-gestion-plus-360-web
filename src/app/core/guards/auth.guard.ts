import { AuthService } from '../../modules/auth/service/auth.service';
import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      }
}
