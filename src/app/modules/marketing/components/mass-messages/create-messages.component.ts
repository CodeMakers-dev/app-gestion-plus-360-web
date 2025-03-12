import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FooterComponent } from "../../../../core/components/footer/footer.component";

@Component({
  selector: 'app-create-messages',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './create-messages.component.html',
  styleUrl: './create-messages.component.css'
})
export class CreateMessagesComponent {
  showInput = false; 
  newButtonText = ''; 
  currentTime: string = '';
  messageForm: FormGroup;
  buttons: string[] = [];
  filePreviews: { name: string; url: string; type: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.messageForm = this.fb.group({
      title: new FormControl(''),
      description: new FormControl('')
    });

    this.description.valueChanges.subscribe(value => {
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
    return this.messageForm.get('title') as FormControl;
  }

  get description(): FormControl {
    return this.messageForm.get('description') as FormControl;
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
  

  trackByIndex(index: number, item: any): number {
    return index;
  }
}
