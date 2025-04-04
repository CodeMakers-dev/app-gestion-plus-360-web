import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';
import { MensajesMasivos } from '@core/interfaces/Imessages';
import { MensajeService } from '@modules/marketing/services/messages.service';

@Component({
  selector: 'app-mensajes-masivos',
  imports: [HeaderComponent, FooterComponent, CommonModule, NavigationComponent],
  templateUrl: './mensajes-masivos.component.html',
  styleUrls: ['./mensajes-masivos.component.css'],
})
export class MensajesMasivosComponent implements OnInit {
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Marketing', url: '/marketing' },
    { label: 'Mensajes Masivos', url: '/marketing/mensajes-masivos' }
  ];
  data: MensajesMasivos[] = [
    {
      titulo: 'Venta Accesorios',
      descripcion: 'Silver',
      fechaCreacion: '2023-01-01',
      archivo: '$2999',
    },
    {
      titulo: 'Venta Accesorios',
      descripcion: 'White',
      fechaCreacion: '2023-01-02',
      archivo: '$1999',
    },
    {
      titulo: 'Venta Accesorios',
      descripcion: 'Black',
      fechaCreacion: '2023-01-03',
      archivo: '$99',
    },
  ];
  filteredData: MensajesMasivos[] = [...this.data];
  activeFilters: { [key: string]: boolean } = {};
  columnFilters: { [key: string]: string } = {};

  previousFilterColumn: string | null = null;

  constructor(private router: Router, private mensajeService: MensajeService) {}

  ngOnInit(): void {}

  applyFilter(event: Event, column: keyof MensajesMasivos) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredData = this.data.filter((item) =>
      item[column].toLowerCase().includes(filterValue)
    );
  }

  navegarCrearMensajes() {
    this.router.navigate(['marketing/create-message']);
  }

  navegarHistorial() {
    this.router.navigate(['marketing/message-history']);
  }

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

  filterData() {
    this.filteredData = this.data.filter(item => {
      let matchesAllFilters = true;

      for (const column in this.columnFilters) {
        if (this.columnFilters[column]) {
          const filterValue = this.columnFilters[column].toLowerCase();
          const itemValue = String(item[column as keyof MensajesMasivos]).toLowerCase(); // Utilizar keyof

          if (!itemValue.includes(filterValue)) {
            matchesAllFilters = false;
            break;
          }
        }
      }

      return matchesAllFilters;
    });
  }
}
