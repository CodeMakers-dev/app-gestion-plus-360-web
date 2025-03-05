import { inject, Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "../../modules/auth/service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/home']);
            return false;
        } else {
            return true;
        }
    }
}
