import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

@Component({
  selector: 'app-message-history',
  imports: [HeaderComponent, FooterComponent, CommonModule, NavigationComponent],
  templateUrl: './message-history.component.html',
  styleUrl: './message-history.component.css'
})
export class MessageHistoryComponent implements OnInit{
  navigationItems = [
    { label: 'Home', url: '/' },
    { label: 'Marketing', url: '/marketing' },
    { label: 'Mensajes Masivos', url: '/marketing/mensajes-masivos' },
    { label: 'Historial de Mensajes', url: '/marketing/message-history' }
  ];

  data = [
    { mensajes: 'Apple MacBook Pro 17"', fechaEnvio: '2023-01-01', contactos: 'Silver', canal: 'Laptop', archivos: '$2999' },
    { mensajes: 'Microsoft Surface Pro', fechaEnvio: '2023-01-02', contactos: 'White', canal: 'Laptop PC', archivos: '$1999' },
    { mensajes: 'Magic Mouse 2', fechaEnvio: '2023-01-03', contactos: 'Black', canal: 'Accessories', archivos: '$99' },
    { mensajes: 'Apple Watch', fechaEnvio: '2023-01-04', contactos: 'Silver', canal: 'Accessories', archivos: '$179' },
    { mensajes: 'iPad', fechaEnvio: '2023-01-05', contactos: 'Gold', canal: 'Tablet', archivos: '$699' },
    { mensajes: 'Apple iMac 27"', fechaEnvio: '2023-01-06', contactos: 'Silver', canal: 'PC Desktop', archivos: '$3999' }
  ];
  filteredData = [...this.data];

  ngOnInit(): void {}

  applyFilter(event: Event, column: keyof typeof this.data[0]) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data.filter(item => item[column].toLowerCase().includes(filterValue));
  }
}
