import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';
import { NotificationService } from '@components/header/services/notification.service';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { IPersona } from '@core/interfaces/IuserById';
import { UserService } from '@modules/auth/service/user.service';
import { MensajeService } from '@modules/marketing/services/messages.service';
import { PersonService } from '@modules/users/services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule, NavigationComponent, FooterComponent],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {

  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Mensajes', url: '/messages' }
  ];

  showSelect = false;
  selectedIcon: 'single' | 'multiple' | null = null;
  persons: IPersona[] = [];
  selectedUserId: number | null = null;
  title: string = '';
  description: string = '';

  constructor(
    private personService: PersonService,
    private userService: UserService,
    private messageService: MensajeService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {}

  showUserSelect(show: boolean) {
    this.showSelect = show;
  }

  selectIcon(icon: 'single' | 'multiple') {
    if (this.selectedIcon === icon) {
      this.selectedIcon = null;
      this.showSelect = false;
    } else {
      this.selectedIcon = icon;
      this.showSelect = icon === 'single';
    }

    console.log('Icono seleccionado en selectIcon:', this.selectedIcon);
    if (this.showSelect) {
      this.personService.getPersons().subscribe(
        (response: ApiResponse<IPersona[]>) => {
          console.log('Datos del servicio:', response.response);
          this.persons = response.response;
        },
        (error) => {
          console.error('Error al obtener personas:', error);
        }
      );
    }
  }

  onUserSelected(event: any) {
    console.log('Valor del select:', event.target.value);
    this.selectedUserId = Number(event.target.value); // ID de la persona seleccionada
    console.log('ID de la persona seleccionada:', this.selectedUserId);
  
    // Validar que el ícono seleccionado sea 'single'
    if (this.selectedIcon !== 'single') {
      console.warn('El ícono seleccionado no es "single". No se realizará la consulta.');
      return;
    }
  
    // Consulta el ID del usuario basado en el ID de la persona
    this.userService.getUserByPersonId(this.selectedUserId).subscribe(
      (response: any) => {
        const userId = response.response.id; // Ajusta según la estructura de la respuesta
        console.log('ID del usuario obtenido:', userId);
        this.selectedUserId = userId; // Actualiza el ID del usuario seleccionado
      },
      (error) => {
        console.error('Error al obtener el ID del usuario:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error al Obtener Usuario',
          text: 'No se pudo obtener el usuario asociado a la persona seleccionada.'
        });
      }
    );
  }

  sendMessage() {
    if (!this.title || !this.description) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Por favor, completa el título y la descripción.'
      });
      return;
    }
  
    if (!this.selectedIcon) {
      Swal.fire({
        icon: 'warning',
        title: 'Icono No Seleccionado',
        text: 'Por favor, selecciona a quien va a enviar el mensaje.'
      });
      return;
    }
  
    if (this.selectedIcon === 'single') {
      if (!this.selectedUserId) {
        Swal.fire({
          icon: 'warning',
          title: 'Usuario No Seleccionado',
          text: 'Por favor, selecciona un usuario antes de enviar el mensaje.'
        });
        return;
      }
  
      const mensaje = {
        usuario: {
          id: this.selectedUserId // Usa el ID del usuario obtenido en onUserSelected
        },
        titulo: this.title,
        descripcion: this.description,
        usuarioCreacion: 'Usuario que inició sesión', // Ajusta según sea necesario
        activo: true
      };
  
      console.log('Mensaje a enviar:', mensaje);
  
      this.messageService.sendMessage(mensaje).subscribe(
        response => {
          this.notificationService.notifyNotificationCreated();
          console.log('Mensaje enviado con éxito:', response);
          Swal.fire({
            icon: 'success',
            title: 'Mensaje Enviado',
            text: 'Mensaje enviado con éxito.'
          });
          this.title = '';
          this.description = '';
        },
        error => {
          console.error('Error al enviar mensaje:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al Enviar Mensaje',
            text: 'Error al enviar mensaje.'
          });
        }
      );
    } else if (this.selectedIcon === 'multiple') {
      const mensaje = {
        titulo: this.title,
        descripcion: this.description,
        usuarioCreacion: 'Usuario que inició sesión' // Ajusta según sea necesario
      };
  
      console.log('Mensaje masivo a enviar:', mensaje);
  
      this.messageService.sendMessageAll(mensaje).subscribe(
        response => {
          console.log('Mensaje enviado a múltiples usuarios con éxito:', response);
          Swal.fire({
            icon: 'success',
            title: 'Mensaje Masivo Enviado',
            text: 'Mensaje enviado a múltiples usuarios con éxito.'
          });
          this.title = '';
          this.description = '';
        },
        error => {
          console.error('Error al enviar mensaje a múltiples usuarios:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al Enviar Mensaje Masivo',
            text: 'Error al enviar mensaje a múltiples usuarios.'
          });
        }
      );
    }
  }
}
