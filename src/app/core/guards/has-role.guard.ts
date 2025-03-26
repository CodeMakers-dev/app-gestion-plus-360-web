import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';
import { AuthService } from '@modules/auth/service/auth.service';
import { Observable, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HasRoleGuard implements CanMatch {
  constructor (private authService: AuthService, private router: Router){}
  canMatch(route: Route, segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const requiredRoles = route.data?.['roles'] as string[];

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.getRole(userId).pipe( // Use RoleService
      switchMap(userRole => {
        if (userRole && requiredRoles.includes(userRole)) {
          return of(true);
        } else {
          this.router.navigate(['/home']);
          return of(false);
        }
      })
    );
  } 
}
