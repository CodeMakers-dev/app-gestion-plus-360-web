import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { IPersona } from '@core/interfaces/IuserById';
import { PersonService } from '@modules/users/services/person.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{
  users: IPersona[] = [];
  filteredUsers: IPersona[] = [];
  selectedColumns: string[] = ['numeroDocumento', 'nombre', 'telefono', 'correo', 'operacion'];

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.personService.getPersons().subscribe((response) => {
      this.users = response.response;
      console.log("USers Clg ------>", this.users);
      this.filteredUsers = [...this.users];
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.nombre.toLowerCase().includes(filterValue) ||
      user.tipoPersona.descripcion.toLowerCase().includes(filterValue) ||
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

  toggleColumn(column: string, event: Event) {
    event.preventDefault();
    const index = this.selectedColumns.indexOf(column);
    if (index > -1) {
      this.selectedColumns.splice(index, 1);
    } else {
      this.selectedColumns.push(column);
    }
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
}
