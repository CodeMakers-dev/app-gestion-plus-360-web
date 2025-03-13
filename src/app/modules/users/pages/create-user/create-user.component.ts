import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { CityService } from '@modules/users/services/city.service';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { response } from 'express';
import { ICiudad, IDepartamento, ITipoDocumento, ITipoPersona } from '@core/interfaces/IuserById';
import { TypePersonService } from '@modules/users/services/typePerson.service';
import { TypeDocumentService } from '@modules/users/services/typeDocument.service';
import { DepartamentService } from '@modules/users/services/departament.service';
import { CountryService } from '../../services/country.service';
import { PersonService } from '../../services/person.service';
import { IPersona } from '../../../../core/interfaces/IuserById';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  tiposPersonName: string[] = [];
  tiposPerson: ITipoPersona[] = [];
  typeDocumentName: string[] = [];
  typeDocument: ITipoDocumento[] = [];
  paises: string[] = [];
  departamentName: string[] = [];
  ciudadName: string[] = [];

  selectedTipoPersonaId: number | null = null;
  selectedTipoDocumentoId: number | null = null;

  constructor(
    private http: HttpClient,
    private cityService: CityService,
    private typePersonService: TypePersonService,
    private typeDocumentService: TypeDocumentService,
    private departamentService: DepartamentService,
    private countryService: CountryService,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.loadTiposPersona();
    this.loadTiposDocumento();
    this.loadPaises();
    this.loadDepartamentos();
    this.loadCiudades();
  }

  loadTiposPersona(): void {
    this.typePersonService.getTypePerson().subscribe((response) => {
      this.tiposPerson = response.response;
      this.tiposPersonName = response.response.map(tipoPersona => tipoPersona.nombre);
    });
  }

  loadTiposDocumento(): void {
    this.typeDocumentService.getAllTypeDocument().subscribe((response) => {
      this.typeDocument = response.response;
      this.typeDocumentName = response.response.map((tipoDocumento) => tipoDocumento.nombre)
    })
  }

  loadPaises(): void {
    this.countryService.getAllCountry().subscribe((response) => {
      this.paises = response.response.map((pais) => pais.nombre);
    })
  }

  loadDepartamentos(): void {
    this.departamentService.getAllDepartament().subscribe((response) => {
      this.departamentName = response.response.map((departamento) => departamento.nombre);
    })
  }

  loadCiudades(): void {
    this.cityService.getCity().subscribe((response) => {
      this.ciudadName = response.response.map((ciudad) => ciudad.nombre);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const persona = {
        tipoPersona: this.selectedTipoPersonaId,
        tipoDocumento: this.selectedTipoDocumentoId,
      }
      console.log('Datos del formulario:', form.value);
      console.log('datos tipo persona:', persona);
    } else {
      console.log('Formulario inválido');
    }
  }
}
