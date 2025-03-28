import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { HeaderComponent } from '@components/header/header.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { IPersona } from '@core/interfaces/IuserById';
import { PersonService } from '@modules/users/services/person.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule, NavigationComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Usuarios', url: '/users' }
  ];

  users: IPersona[] = [];
  filteredUsers: IPersona[] = [];
  selectedColumns: string[] = ['numeroDocumento', 'nombre', 'telefono', 'correo', 'operacion'];
  paginaActual = 1;
  itemsPorPagina = 5;
  columnFilters: { [key: string]: string } = {};
  activeFilters: { [key: string]: boolean } = {};

  previousFilterColumn: string | null = null;

  constructor(private personService: PersonService) {}

  get datosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = Math.min(
      inicio + this.itemsPorPagina,
      this.filteredUsers.length
    );
    return this.filteredUsers.slice(inicio, fin);
  }

  totalPaginas(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPorPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }

  applyColumnFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.columnFilters[column] = filterValue;
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.filteredUsers = this.users.filter((payment) => {
      return Object.keys(this.columnFilters).every((column) => {
        const value = this.getColumnValue(payment, column);
        return value.includes(this.columnFilters[column]);
      });
    });
  }

  ngOnInit(): void {
    this.loadPerson();
  }

  loadPerson(): void {
    this.personService.getPersons().subscribe((response) => {
      this.users = response.response;
      this.users = response.response.filter((user: any) => user.activo === true);
      console.log("Users Clg ------>", this.users);
      this.filteredUsers = [...this.users];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nombre.toLowerCase().includes(filterValue) ||
      user.tipoPersona.nombre.toLowerCase().includes(filterValue) ||
      user.tipoDocumento.descripcion.toLowerCase().includes(filterValue) ||
      user.numeroDocumento.toLowerCase().includes(filterValue) ||
      user.pais.nombre.toLowerCase().includes(filterValue) ||
      user.departamento.nombre.toLowerCase().includes(filterValue) ||
      user.ciudad.nombre.toLowerCase().includes(filterValue) ||
      user.direccion.toLowerCase().includes(filterValue) ||
      user.actividadEconomica.toLowerCase().includes(filterValue) ||
      user.telefono.toLowerCase().includes(filterValue) ||
      user.correo.toLowerCase().includes(filterValue)
    );
  }

  getColumnValue(user: IPersona, column: string): string {
    switch (column) {
        case 'numeroDocumento':
            return user.numeroDocumento?.toString().toLowerCase() || '';
        case 'nombre':
            return user.nombre?.toLowerCase() || '';
        case 'tipoDocumento':
            return user.tipoDocumento?.descripcion?.toLowerCase() || '';
        case 'tipoPersona':
            return user.tipoPersona?.nombre?.toLowerCase() || '';
        case 'pais':
            return user.pais?.nombre?.toLowerCase() || '';
        case 'departamento':
            return user.departamento?.nombre?.toLowerCase() || '';
        case 'ciudad':
            return user.ciudad?.nombre?.toLowerCase() || '';
        case 'direccion':
            return user.direccion?.toLowerCase() || '';
        case 'actividadEconomica':
            return user.actividadEconomica?.toLowerCase() || '';
        case 'telefono':
            return user.telefono?.toLowerCase() || '';
        case 'correo':
            return user.correo?.toLowerCase() || '';
        default:
            return '';
    }
}

  toggleColumn(column: string, event: Event) {
    event.preventDefault();
    const index = this.selectedColumns.indexOf(column);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(column);
    }
  }

  toggleFilter(column: string) {
    if (this.previousFilterColumn && this.previousFilterColumn !== column && this.activeFilters[this.previousFilterColumn]) {
      this.activeFilters[this.previousFilterColumn] = false;
    }

    this.activeFilters[column] = !this.activeFilters[column];
    this.previousFilterColumn = column;
  }

  isColumnSelected(column: string): boolean {
    return this.selectedColumns.includes(column);
  }

  toggleDropdown() {
    const dropdown = document.getElementById('dropdownAction');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  confirmBlockUser(user: IPersona): void {
    if (user.id === undefined) {
        console.error("User ID is undefined, cannot block user.");
        return;
    }

    Swal.fire({
        title: "¿Bloquear Usuario?",
        text: `¿Estás seguro que deseas bloquear al usuario ${user.nombre}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, Bloquear"
    }).then((result) => {
        if (result.isConfirmed) {
            this.blockPerson(user.id!);
        }
    });
}

  blockPerson(userId: number): void {
    console.log("Bloquear usuario con ID:", userId);
    this.personService.blockPerson(userId).subscribe({
      next: (response) => {
        Swal.fire({
          title: "Bloqueado",
          text: response.message,
          icon: "success"
        });
        this.loadPerson();
      },
      error: (err) => {
        console.error("Error al bloquear usuario:", err);
        Swal.fire({
          title: "Error",
          text: "No se pudo bloquear el usuario.",
          icon: "error"
        });
      }
    });
  }
}
