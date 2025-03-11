import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-messages',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './create-messages.component.html',
  styleUrl: './create-messages.component.css'
})
export class CreateMessagesComponent {
  messageForm: FormGroup;
  buttons: string[] = [];
  filePreviews: { name: string; url: string; type: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      title: new FormControl(''),
      description: new FormControl('')
    });
  }

  get title(): FormControl {
    return this.messageForm.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.messageForm.get('description') as FormControl;
  }

  addButton() {
    const newButton = prompt("Ingrese el texto del botón:");
    if (newButton) {
      this.buttons = [...this.buttons, newButton];
    }
  }

  removeButton(index: number) {
    this.buttons.splice(index, 1);
    this.buttons = [...this.buttons];
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
  

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
