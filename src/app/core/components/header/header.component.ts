import { UserService } from './../../../modules/auth/service/user.service';
import { Component, ElementRef, HostListener, OnInit, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  sidebarOpen = false;
  searchQuery = '';
  userImage: string = 'perfil.png';
  userName: string = '';
  userEmail: string = '';
  showPassword: boolean = false;
  userPassword: string = '';
  isProfileModalOpen: boolean = false;
  isEditUserModalOpen: boolean = false;
  isImagePreviewOpen: boolean = false; // Variable para la vista previa

   // ViewChild para acceder al input de archivo
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

   constructor(private authService: AuthService, private router: Router, private userService: UserService) {}

   ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log('UserId:', userId);
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('ResponseGetPerson:', user.response.persona.nombre);
        this.userName = user.response.persona.nombre; // Ajusta esto según la estructura de tu respuesta
        this.userEmail = user.response.usuario; // Ajusta esto según la estructura de tu respuesta
      });
    }
  }

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  openEditUserModal() {
    this.isProfileModalOpen = false;
    this.isEditUserModalOpen = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  closeEditUserModal() {
    this.isEditUserModalOpen = false;
  }

  openImagePreview() {
    this.isImagePreviewOpen = true;
  }

  closeImagePreview() {
    this.isImagePreviewOpen = false;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImage = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    console.log('Perfil guardado:', this.userName, this.userImage);
    this.closeProfileModal();
  }

  saveUserChanges() {
    console.log('Cambios guardados:', this.userName, this.userEmail);
    this.closeEditUserModal();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSearch() {
    console.log('Buscando:', this.searchQuery);
  }

  onFileInputClick(event: MouseEvent) {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (this.sidebarOpen &&
        !target.closest('.sidebar') &&
        !target.closest('.menu-container')) {
      this.sidebarOpen = false;
    }
  }

  logout() {
    this.authService.logout(); // Llama al servicio para cerrar sesión
    this.router.navigate(['/login']); // Redirige al login
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
