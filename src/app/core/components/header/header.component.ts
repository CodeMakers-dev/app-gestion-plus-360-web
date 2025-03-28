import { UserService } from './../../../modules/auth/service/user.service';
import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@services/auth.service';
import { NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { MensajeService } from '@modules/marketing/services/messages.service';
import { MessageNotifications } from '@core/interfaces/ImessageNotifications';
import { initFlowbite } from 'flowbite';
import { PersonService } from '@modules/users/services/person.service';
import Swal from 'sweetalert2';
import { IPersona } from '@core/interfaces/IuserById';
import { NotificationService } from './services/notification.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, AfterViewInit {
  searchTerm: string = '';
  sidebarOpen = false;
  activeRoute: string = '';
  searchQuery = '';
  userImage: string = 'perfil.png';
  userName: string = '';
  userEmail: string = '';
  showPassword: boolean = false;
  userPassword: string = '';
  isProfileModalOpen: boolean = false;
  isEditUserModalOpen: boolean = false;
  isImagePreviewOpen: boolean = false;
  isAlertModalOpen: boolean = false;
  alertTitle: string = '';
  alertMessage: string = '';
  isNotificationModalOpen: boolean = false;
  notifications: MessageNotifications[] = [];
  unreadNotificationsCount = 0;

  selectedFile: File | null = null;
  showConfirmModal = false;
  userRole: string | null = null;

  // ViewChild para acceder al input de archivo
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private userService: UserService, 
    private messageService: MensajeService, 
    private personService: PersonService, 
    private notificationService: NotificationService) { }

   
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.updateUnreadNotificationsCount();
    this.notificationService.notificationCreated$.subscribe(() => {
      this.updateUnreadNotificationsCount();
    });
    this.activeRoute = this.router.url;
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.url;
    });
    const userId = this.authService.getUserId();
    console.log('UserId:', userId);
    if (userId !== null) {
      this.userService.getUserById(userId).subscribe(user => {
        console.log('ResponseGetPerson:', user.response.persona.nombre);
        this.userName = user.response.persona.nombre;
        this.userEmail = user.response.usuario;
      });
    }
    this.loadProfileImage();
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
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.showConfirmModal = true;
    }
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.selectedFile = null;
  }

  confirmUpload() {
    this.showConfirmModal = false;
    this.uploadImage();
  }

  uploadImage() {
    if (!this.selectedFile) {
      console.error('No se ha seleccionado ningún archivo.');
      return;
    }

    const userId = this.authService.getUserId();

    if (userId === null) {
      console.error('No se pudo obtener el ID del usuario.');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        const personaId = user.response.persona.id;

        if (personaId === undefined) {
          console.error('No se pudo obtener el ID de la persona.');
          return;
        }

        if (this.selectedFile) {
          const file: File = this.selectedFile;

          this.personService.uploadProfileImage(personaId, file).subscribe({
            next: (response) => {
              Swal.fire({
                title: "Imagen Actualizada",
                text: response.message,
                icon: "success"
              });
              this.userImage = URL.createObjectURL(file);
              this.selectedFile = null;
              this.closeProfileModal();
            },
            error: (err) => {
              console.error("Error al actualizar imagen:", err);
              Swal.fire({
                title: "Error",
                text: err.message,
                icon: "error"
              });
            }
          });
        } else {
          console.error('El archivo seleccionado es nulo después de la verificación inicial.');
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario', error);
      }
    });
  }

  loadProfileImage() {
    const storedImageUrl = this.authService.getProfileImageUrl();
    console.log('Retrieved Image URL:', storedImageUrl);

    if (storedImageUrl) {
      this.userImage = storedImageUrl;
      console.log('Image URL from AuthService:', this.userImage);
      return;
    }

    const userId = this.authService.getUserId();

    if (userId === null) {
      console.error('No se pudo obtener el ID del usuario.');
      return;
    }

    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        const persona: IPersona = user.response.persona;

        if (persona && persona.imagen) {
          try {
            const byteArray = new Uint8Array(this.base64ToArrayBuffer(persona.imagen));
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            this.userImage = URL.createObjectURL(blob);
            console.log();
          } catch (error) {
            console.error('Error al convertir la imagen:', error);
            this.userImage = 'public/perfil.png';
          }
          if (this.userImage) {
            console.log('Stored Image URL:', this.userImage);
            this.authService.setProfileImageUrl(this.userImage);
          }

        } else {
          this.userImage = 'public/perfil.png';
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario', error);
        this.userImage = 'public/perfil.png';
      }
    });
  }

  base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
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
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres eliminar esta notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const userId = this.authService.getUserId();

        if (userId) {
          this.userService.getUserById(userId).subscribe(user => {
            const userName = user.response.persona.nombre;

            const mensaje: MessageNotifications = {
              id: notification.id,
              usuario: { id: userId },
              titulo: notification.titulo,
              descripcion: notification.descripcion,
              usuarioCreacion: notification.usuarioCreacion,
              fechaEnvio: notification.fechaEnvio,
              fechaCreacion: notification.fechaCreacion,
              usuarioModificacion: userName,
              fechaModificacion: new Date().toISOString(),
              activo: false
            };

            console.log('Updating notification status______________________________:', JSON.stringify(mensaje));
            this.messageService.updateNotificationStatus(mensaje).subscribe(() => {
              this.notifications = this.notifications.filter(n => n.id !== notification.id);
              this.updateUnreadNotificationsCount();
              console.log('Notification status updated successfully', mensaje);
            }, error => {
              console.error('Error updating notification status:', error);
            });
          }, error => {
            console.error('Error getting user name:', error);
          });
        } else {
          console.error('User ID not found');
        }
      }
    });
  }

  updateUnreadNotificationsCount() {
    const userId = this.authService.getUserId();
    if (userId !== null) {
        this.messageService.getMessagesByUserId(userId).subscribe((response: ApiResponse<MessageNotifications[]>) => {
            this.unreadNotificationsCount = response.response.filter(notification => notification.activo).length;
            console.log("Numero de notificaciones------------", this.unreadNotificationsCount)
        }, error => {
            console.error('Error fetching notifications for count:', error);
            if (error.status === 401 || error.status === 403) {
                this.router.navigate(['/login']);
            }
        });
    }
}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  onSearch() {
    console.log('Buscando:', this.searchQuery);
  }

  onFileInputClick(event: Event) {
    event.stopPropagation();
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('fileInput no está inicializado.');
    }
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
    Swal.fire({
      title: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  goTo(route: string) {
    this.router.navigate([route]);
    this.sidebarOpen = false;
  }

  hasAccess(route: string): boolean {
    if (!this.userRole) {
      return false;
    }

    switch (route) {
      case '/home':
        return true;
      case '/marketing':
        return this.userRole === 'ADMIN' || this.userRole === 'CONSULTA';
      case '/users':
      case '/payments':
      case '/messages':
        return this.userRole === 'ADMIN';
      default:
        return false;
    }
  }
}
