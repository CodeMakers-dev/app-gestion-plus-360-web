import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@modules/auth/service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css',
})
export class RecoverPasswordComponent {
  usuario: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  recuperarContrasena() {
    if (!this.usuario) {
      Swal.fire({
        icon: 'warning',
        title: 'Campo vacío',
        text: 'Por favor, ingresa tu usuario.',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    this.authService.recoverPassword(this.usuario).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          title: 'Correo enviado',
          text: 'Se ha enviado un correo de recuperación.'
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el correo.',
          confirmButtonText: 'Intentar de nuevo',
        });
      },
    });
  }
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
