import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { IPersona } from '@core/interfaces/IuserById';
import { UserService } from '@modules/auth/service/user.service';
import { MensajeService } from '@modules/marketing/services/messages.service';
import { PersonService } from '@modules/users/services/person.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  showSelect = false;
  selectedIcon: 'single' | 'multiple' | null = null;
  persons: IPersona[] = [];
  selectedUserId: number | null = null;
  title: string = '';
  description: string = '';

  constructor(private personService: PersonService, private userService: UserService, private messageService: MensajeService) { }

  ngOnInit() { }

  showUserSelect(show: boolean) {
    this.showSelect = show;
  }

  selectIcon(icon: 'single' | 'multiple') {
    this.selectedIcon = icon;
    this.showSelect = icon === 'single';

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
    this.selectedUserId = event.target.value;
    console.log('ID del usuario seleccionado:', this.selectedUserId);
  }

  sendMessage() {
    if (!this.title || !this.description) {
        alert('Por favor, completa el título y la descripción.');
        return;
    }

    if (!this.selectedIcon) {
      alert('Por favor, selecciona un icono antes de enviar el mensaje.');
      return;
    }

    const userId: number | null = localStorage.getItem("userId")
        ? Number(localStorage.getItem("userId"))
        : null;

    if (userId) {
        this.userService.getUserById(userId).subscribe(user => {
            const usuarioCreacion = user.response.persona.nombre;
            const personId = user.response.id;

            console.log('Valor de this.selectedIcon:', this.selectedIcon);

            if (this.selectedIcon === 'single') {
                if (this.selectedUserId) {
                    const mensaje = {
                        usuario: {
                            id: personId // Usar personId obtenido aquí
                        },
                        titulo: this.title,
                        descripcion: this.description,
                        usuarioCreacion: usuarioCreacion
                    };

                    this.messageService.sendMessage(mensaje).subscribe(
                        response => {
                            console.log('Mensaje enviado con éxito:', response);
                            alert('Mensaje enviado con éxito.');
                            this.title = '';
                            this.description = '';
                        },
                        error => {
                            console.error('Error al enviar mensaje:', error);
                            alert('Error al enviar mensaje.');
                        }
                    );
                } else {
                    alert('Por favor, selecciona un usuario.');
                }
            } else if (this.selectedIcon === 'multiple') {
                const mensaje = {
                    titulo: this.title,
                    descripcion: this.description,
                    usuarioCreacion: usuarioCreacion
                };

                this.messageService.sendMessageAll(mensaje).subscribe(
                    response => {
                        console.log('Mensaje enviado a múltiples usuarios con éxito:', response);
                        alert('Mensaje enviado a múltiples usuarios con éxito.');
                        this.title = '';
                        this.description = '';
                    },
                    error => {
                        console.error('Error al enviar mensaje a múltiples usuarios:', error);
                        alert('Error al enviar mensaje a múltiples usuarios.');
                    }
                );
            }
        });
    } else {
        alert('No se encontró el ID del usuario en el almacenamiento local.');
    }
}
}
