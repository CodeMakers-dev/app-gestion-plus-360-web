import { UserService } from './../../../modules/auth/service/user.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild  } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { MensajeService } from '@modules/marketing/services/messages.service';
import { MessageNotifications } from '@core/interfaces/ImessageNotifications';
import { initFlowbite } from 'flowbite';
import { parse } from 'path';
import { title } from 'process';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  sidebarOpen = false;
  searchQuery = '';
  userImage: string = 'perfil.png';
  userName: string = '';
  userEmail: string = '';
  showPassword: boolean = false;
  userPassword: string = '';
  isProfileModalOpen: boolean = false;
  isEditUserModalOpen: boolean = false;
  isImagePreviewOpen: boolean = false;
  isAlertModalOpen: boolean = false; // Variable para el modal de alerta
  alertTitle: string = ''; // Título del modal de alerta
  alertMessage: string = '';
  isNotificationModalOpen: boolean = false; // Variable para el modal de notificaciones
  notifications: MessageNotifications[] = []; // Lista de notificaciones

   // ViewChild para acceder al input de archivo
   @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

   constructor(private authService: AuthService, private router: Router, private userService: UserService, private messageService: MensajeService) {}

   ngOnInit(): void {
    const userId = this.authService.getUserId();
    console.log('UserId:', userId);
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('ResponseGetPerson:', user.response.persona.nombre);
        this.userName = user.response.persona.nombre;
        this.userEmail = user.response.usuario;
      });
    }
  }

  ngAfterViewInit() {
    initFlowbite();
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

  cancelEditUser() {
    this.closeEditUserModal();
    this.openProfileModal();
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
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.userService.updatePassword(userId, this.userPassword).subscribe((response: ApiResponse<null>) => {
        console.log('Password updated successfully:', response);
        this.alertTitle = 'Éxito';
        this.alertMessage = response.message;
        this.isAlertModalOpen = true;
        this.closeEditUserModal();
      }, error => {
        console.error('Error updating password:', error);
        this.alertTitle = 'Error';
        this.alertMessage = error.error.message;
        this.isAlertModalOpen = true;
      });
    }
  }

  closeAlertModal() {
    this.isAlertModalOpen = false;
  }

  openNotificationModal() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.messageService.getMessagesByUserId(userId).subscribe((response: ApiResponse<MessageNotifications[]>) => {
        // Filtrar solo las notificaciones activas
        this.notifications = response.response.filter(notification => notification.activo);
        this.isNotificationModalOpen = true;
      }, error => {
        console.error('Error fetching notifications:', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  closeNotificationModal() {
    this.isNotificationModalOpen = false;
  }

  // markNotificationAsInactive(notification: MessageNotifications) {
  //   const updatedNotification = {
  //     ...notification,
  //     activo: false
  //   };
  //   console.log('Updating notification status______________________________:', JSON.stringify(updatedNotification));

  //   this.messageService.updateNotificationStatus(updatedNotification).subscribe(() => {
  //     this.notifications = this.notifications.filter(n => n.id !== notification.id);
  //     console.log('Notification status updated successfully', updatedNotification);
  //   }, error => {
  //     console.error('Error updating notification status:', error);
  //   });
  // }

  markNotificationAsInactive(notification: MessageNotifications) {
    const userId = this.authService.getUserId();
    const mensaje: MessageNotifications = {
      id: notification.id,
      usuario: userId,
      titulo: notification.titulo,
      descripcion: notification.descripcion,
      usuarioCreacion: notification.usuarioCreacion,
      fechaEnvio: notification.fechaEnvio,
      fechaCreacion: notification.fechaCreacion,
      usuarioModificacion: userId ? userId.toString() : null,
      fechaModificacion: new Date().toISOString(),
      activo: false
    };
    console.log('Updating notification status______________________________:', JSON.stringify(mensaje));
    this.messageService.updateNotificationStatus(mensaje).subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        console.log('Notification status updated successfully', mensaje);
      }, error => {
        console.error('Error updating notification status:', error);
      });
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
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goTo(route: string) {
    this.router.navigate([route]);
  }
}
