import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent {
  usuario: string = '';
  constructor(
      private router: Router
    ){}

  recuperarContrasena() {
    console.log('Recuperar contraseña para:', this.usuario);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
