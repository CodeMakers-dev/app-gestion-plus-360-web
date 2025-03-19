import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,  FormsModule,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-password',
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.css'
})
export class CreatePasswordComponent implements OnInit{
  resetForm: FormGroup;
  llave!: string;
  apiUrl = 'http://localhost:8080/api/v1/Usuario/reset-password';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatch });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
  ngOnInit(): void {
  
    this.llave = this.route.snapshot.queryParamMap.get('llave') || '';

    console.log('Llave recibida:', this.llave);

    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordValidator(control: any) {
    const password = control.value;
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    return regex.test(password) ? null : { invalidPassword: true };
  }
  createPassword(): void {
    console.log('Botón presionado');

    if (!this.llave) {
      console.error('Error: Llave no recibida');
      return;
    }

    if (!this.resetForm.valid) {
      console.error('Error: Formulario inválido', this.resetForm.errors);
      return;
    }

    const newPassword = this.resetForm.value.newPassword;
    console.log('Datos enviados:', { password: newPassword });

    this.http.post(`${this.apiUrl}?llave=${this.llave}`, { password: newPassword }, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        console.log('Respuesta del backend:', response);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Contraseña creada exitosamente',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (err) => {
        console.error('Error al crear la contraseña:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.error.message || 'No se pudo crear la contraseña',
          confirmButtonText: 'Intentar de nuevo'
        });
      }
    });
  } 
}

