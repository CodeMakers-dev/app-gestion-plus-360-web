import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent{
  loginForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]], // Validación de correo
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { usuario, password } = this.loginForm.value;
      console.log({ usuario, password });
      this.authService.login(usuario, password).subscribe(
        (response) => {
          localStorage.setItem('token', response.response.token);
        },
        (error) => {
          console.error('Error de autenticación', error);
          Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: error.error.message,
            confirmButtonText: 'Intentar de nuevo'
          });
        }
      );
    }
  }
  goTo(route: string) {
    this.router.navigate([route]);
  }
}
