import { Component, ElementRef, HostListener, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sidebarOpen = false;
  searchQuery = '';
  userImage: string = 'perfil.png'; 
  userName: string = 'Usuario'; 
  isProfileModalOpen: boolean = false;
  isImagePreviewOpen: boolean = false; // Variable para la vista previa

   // ViewChild para acceder al input de archivo
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
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
  constructor(private authService: AuthService, private router: Router) {}
  logout() {
    this.authService.logout(); // Llama al servicio para cerrar sesión
    this.router.navigate(['/login']); // Redirige al login
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
