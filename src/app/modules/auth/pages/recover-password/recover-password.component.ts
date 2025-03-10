import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/service/auth.service';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  usuario: string = '';

  constructor(private authService: AuthService,private router: Router) {}

  recuperarContrasena() {
    if (!this.usuario) {
      alert('Por favor, ingresa tu usuario.');
      return;
    }

    this.authService.recoverPassword(this.usuario).subscribe({
      next: () => {
        alert('Correo de recuperación enviado.');
      },
      error: () => {
        alert('Error al enviar el correo.');
      }
    });
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
