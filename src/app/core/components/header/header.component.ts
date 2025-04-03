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
  userImage: string | null = null;
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

  loadProfileImage(): void {
    // Intenta obtener la URL de la imagen almacenada en localStorage
    const storedImageUrl = this.authService.getProfileImageUrl();
    console.log('Retrieved Image URL:', storedImageUrl);
  
    if (storedImageUrl) {
      this.userImage = storedImageUrl;
      console.log('Image URL from AuthService:', this.userImage);
      return;
    }
  
    // Obtén el ID del usuario
    const userId = this.authService.getUserId();
    if (userId === null) {
      console.error('No se pudo obtener el ID del usuario.');
      this.userImage = null; // No asigna una imagen por defecto
      return;
    }
  
    // Llama al servicio para obtener los datos del usuario
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        const persona: IPersona = user.response.persona;
  
        if (persona && persona.imagen) {
          try {
            // Convierte la imagen Base64 a Blob y genera una URL
            const byteArray = new Uint8Array(this.base64ToArrayBuffer(persona.imagen));
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            this.userImage = URL.createObjectURL(blob);
            console.log('Generated Image URL:', this.userImage);
  
            this.authService.setProfileImageUrl(this.userImage);
          } catch (error) {
            console.error('Error al convertir la imagen:', error);
            this.userImage = null;
          }
        } else {
          this.userImage = null;
        }
      },
      error: (error) => {
        console.error('Error al obtener la información del usuario:', error);
        this.userImage = null;
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
        this.userService.updatePassword(userId, this.userPassword).subscribe(
            (response: ApiResponse<null>) => {
                console.log('Password updated successfully:', response);
                Swal.fire({
                    title: 'Éxito',
                    text: response.message,
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                this.closeEditUserModal();
            },
            (error) => {
                console.error('Error updating password:', error);
                Swal.fire({
                    title: 'Error',
                    text: error.error.message,
                    icon: 'error',
                    timer: 3000,
                    showConfirmButton: false
                });
            }
        );
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
    const userId = this.authService.getUserId();

    if (userId) {
        // Itera sobre todas las notificaciones activas y las inactiva
        const inactivateRequests = this.notifications.map(notification => {
            const mensaje: MessageNotifications = {
                id: notification.id,
                usuario: { id: userId },
                titulo: notification.titulo,
                descripcion: notification.descripcion,
                usuarioCreacion: notification.usuarioCreacion,
                fechaEnvio: notification.fechaEnvio,
                fechaCreacion: notification.fechaCreacion,
                usuarioModificacion: this.userName,
                fechaModificacion: new Date().toISOString(),
                activo: false
            };

            return this.messageService.updateNotificationStatus(mensaje);
        });

        // Ejecuta todas las solicitudes de inactivación
        Promise.all(inactivateRequests.map(req => req.toPromise()))
            .then(() => {
                this.notifications = []; // Limpia la lista de notificaciones
                this.updateUnreadNotificationsCount(); // Actualiza el contador de notificaciones no leídas
                console.log('Todas las notificaciones han sido inactivadas.');
            })
            .catch(error => {
                console.error('Error al inactivar las notificaciones:', error);
            });
    }

    this.isNotificationModalOpen = false; // Cierra el modal
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
