import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';

interface MensajeHistorial {
  mensajes: string;
  fechaEnvio: string;
  contactos: string;
  canal: string;
  archivos: string;
}

@Component({
  selector: 'app-message-history',
  imports: [HeaderComponent, FooterComponent, CommonModule, NavigationComponent],
  templateUrl: './message-history.component.html',
  styleUrl: './message-history.component.css'
})
export class MessageHistoryComponent implements OnInit{
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Marketing', url: '/marketing' },
    { label: 'Mensajes Masivos', url: '/marketing/mensajes-masivos' },
    { label: 'Historial de Mensajes', url: '/marketing/message-history' }
  ];

  data: MensajeHistorial[] = [
    { mensajes: 'Apple MacBook Pro 17"', fechaEnvio: '2023-01-01', contactos: 'Silver', canal: 'Laptop', archivos: '$2999' },
    { mensajes: 'Microsoft Surface Pro', fechaEnvio: '2023-01-02', contactos: 'White', canal: 'Laptop PC', archivos: '$1999' },
    { mensajes: 'Magic Mouse 2', fechaEnvio: '2023-01-03', contactos: 'Black', canal: 'Accessories', archivos: '$99' },
    { mensajes: 'Apple Watch', fechaEnvio: '2023-01-04', contactos: 'Silver', canal: 'Accessories', archivos: '$179' },
    { mensajes: 'iPad', fechaEnvio: '2023-01-05', contactos: 'Gold', canal: 'Tablet', archivos: '$699' },
    { mensajes: 'Apple iMac 27"', fechaEnvio: '2023-01-06', contactos: 'Silver', canal: 'PC Desktop', archivos: '$3999' }
  ];
  filteredData: MensajeHistorial[] = [...this.data];
  activeFilters: { [key: string]: boolean } = {};
  columnFilters: { [key: string]: string } = {};

  previousFilterColumn: string | null = null;

  paginaActual = 1;
  itemsPorPagina = 5;

  ngOnInit(): void {}

  toggleFilter(column: string) {
    if (this.previousFilterColumn && this.previousFilterColumn !== column && this.activeFilters[this.previousFilterColumn]) {
      this.activeFilters[this.previousFilterColumn] = false;
    }

    this.activeFilters[column] = !this.activeFilters[column];
    this.previousFilterColumn = column;
  }

  applyColumnFilter(event: any, column: string) {
    this.columnFilters[column] = event.target.value;
    this.filterData();
  }

  filterData(): MensajeHistorial[] {
    const result = this.data.filter(item => {
      let matchesAllFilters = true;

      for (const column in this.columnFilters) {
        if (this.columnFilters[column]) {
          const filterValue = this.columnFilters[column].toLowerCase();
          const itemValue = String(item[column as keyof MensajeHistorial]).toLowerCase();

          if (!itemValue.includes(filterValue)) {
            matchesAllFilters = false;
            break;
          }
        }
      }

      return matchesAllFilters;
    });

    console.log("Tipo de retorno de filterData:", result); // Verificar el tipo de retorno

    return result;
  }

  aplicarPaginacion() {
    const dataFiltrada = this.filterData();
    if (Array.isArray(dataFiltrada)) {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      const fin = inicio + this.itemsPorPagina;
      this.filteredData = dataFiltrada.slice(inicio, fin);
    } else {
      console.error("filterData no devolvió un arreglo.");
    }
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
      this.aplicarPaginacion();
    }
  }

  totalPaginas(): number {
    return Math.ceil(this.filterData().length / this.itemsPorPagina);
  }
}
