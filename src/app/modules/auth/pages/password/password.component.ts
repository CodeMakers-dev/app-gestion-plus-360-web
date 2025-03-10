import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  ReactiveFormsModule,  Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  resetForm: FormGroup;
  token: string | null = null;
  apiUrl = 'http://localhost:8080/api/v1/Usuario/password';
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

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  passwordsMatch(group: FormGroup) {
    return group.get('newPassword')?.value === group.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }

  resetPassword(): void {
    if (this.resetForm.valid && this.token) {
      const newPassword = this.resetForm.value.newPassword;
      this.http.put(`${this.apiUrl}?token=${this.token}`, 
        { usuario: '', password: newPassword }, 
        { headers: { 'Content-Type': 'application/json' } }
      ).subscribe({
        next: (response) => {
          alert('Contraseña actualizada con éxito');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error al actualizar la contraseña', err);
          alert('Error: ' + (err.error.message || 'No se pudo actualizar la contraseña'));
        }
      });
    }
  }
  
}
