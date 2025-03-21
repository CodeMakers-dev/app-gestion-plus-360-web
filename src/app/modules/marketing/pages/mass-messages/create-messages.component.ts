import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import { CreateMessageService } from '@modules/marketing/services/create-message.service';
import Swal from 'sweetalert2';
import { error } from 'console';
import { NavigationComponent } from '@components/navigation/navigation.component';

@Component({
  selector: 'app-create-messages',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HeaderComponent, FooterComponent,NavigationComponent],
  templateUrl: './create-messages.component.html',
  styleUrl: './create-messages.component.css'
})
export class CreateMessagesComponent implements OnInit{
  showInput = false; 
  newButtonText = ''; 
  currentTime: string = '';
  messageForm: FormGroup;
  buttons: string[] = [];
  filePreviews: { name: string; url: string; type: string }[] = [];


  navigationItems = [
    { label: 'Home', url: '/' },
    { label: 'Marketing', url: '/marketing' },
    { label: 'Mensajes masivos', url: '/marketing/mensajes-masivos' },
    { label: 'Crear mensaje', url: '/create-message' }
  ];

  constructor(private fb: FormBuilder, private createMessageService: CreateMessageService) {
    this.messageForm = this.fb.group({
      title: new FormControl(''),
      description: new FormControl('')
    });

    this.messageForm.controls['description'].valueChanges.subscribe(value => {
      if (value.trim()) {
        this.updateTime();
      }
    });
  }

  updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  get title(): FormControl {
    return this.messageForm.controls['title'] as FormControl;
  }

  get description(): FormControl {
    return this.messageForm.controls['description'] as FormControl;
  }

  addButton() {
    if (this.newButtonText.trim()) {
      this.buttons.push(this.newButtonText);
      this.newButtonText = '';
      this.showInput = false; 
    }
  }

  removeButton(index: number) {
    this.buttons.splice(index, 1);
  }

  onFilesSelected(event: any) {
    const files = event.target.files;
    if (files) {
      for (let file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreviews.push({ name: file.name, url: e.target.result, type: file.type });
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeFile(index: number) {
    this.filePreviews.splice(index, 1);
  }
  
  trackByIndex(index: number, _item: any): number {
    return index;
  }
  
  saveMessage() {
    if (this.filePreviews.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Archivo requerido',
        text: 'Debes adjuntar al menos un archivo antes de enviar el mensaje.',
        confirmButtonColor: '#d33'
      });
      return;
    }
  
    const filePromises = this.filePreviews.map(file =>
      fetch(file.url)
        .then(res => res.blob())
        .then(blob => new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const result = reader.result as string;
            if (result) {
              const base64String = result.split(',')[1]; // Extraer contenido Base64
              resolve(base64String);
            } else {
              resolve('');
            }
          };
        }))
    );
  
    const token = localStorage.getItem('token') || '';
  
    Promise.all(filePromises).then(base64Files => {
      const archivos = base64Files.map((base64, index) => ({
        archivo: base64, 
        activo: true
      }));
  
      if (archivos.length === 0 || archivos.some(a => !a.archivo)) {
        Swal.fire({
          icon: 'warning',
          title: 'Error en archivos',
          text: 'No se pudieron procesar correctamente los archivos adjuntos.',
          confirmButtonColor: '#d33'
        });
        return;
      }
  
      const request = {
        mensajeMasivo: {
          titulo: this.title.value,
          mensaje: this.description.value,
          activo: true
        },
        archivos,
        botones: this.buttons.map(button => ({ button, activo:true})),
      };
  
      this.createMessageService.sendMensajeMasivo(request, token).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje Creado',
            text: 'El mensaje se ha creado exitosamente.',
            confirmButtonColor: '#3085d6'
          });
        },
        error: (error) => {
          console.error('Error al enviar mensaje:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error al enviar',
            text: 'Hubo un problema al enviar el mensaje.',
            confirmButtonColor: '#d33'
          });
        }
      });
    });
  }
  
  
  ngOnInit(): void {}
}
