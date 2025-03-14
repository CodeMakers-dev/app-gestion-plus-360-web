import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { CityService } from '@modules/users/services/city.service';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { response } from 'express';
import { ICiudad, IDepartamento, IPais, ITipoDocumento, ITipoPersona } from '@core/interfaces/IuserById';
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
  country: IPais[] = [];
  paises: string[] = [];
  departamento: IDepartamento[] = [];
  departamentName: string[] = [];
  ciudadName: string[] = [];
  ciudad: ICiudad[] = [];

  selectedTipoPersonaId: number | null = null;
  selectedTipoDocumentoId: number | null = null;
  selectedPaisId: number | null = null;
  selectDepartamentoId: number | null = null;
  selectCiudadId: number | null = null;

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
      this.country = response.response;
      this.paises = response.response.map((pais) => pais.nombre);
    })
  }

  loadDepartamentos(): void {
    this.departamentService.getAllDepartament().subscribe((response) => {
      this.departamento = response.response;
      console.log("Departamento Service-> ", this.departamento)
      this.departamentName = response.response.map((departamento) => departamento.nombre);
    })
  }

  loadCiudades(): void {
    this.cityService.getCity().subscribe((response) => {
      this.ciudad = response.response;
      this.ciudadName = response.response.map((ciudad) => ciudad.nombre);
    });
  }

  onSubmit(form: NgForm): void {
    if (form.valid) {
      const persona = {
        tipoPersona: Object(Number(this.selectedTipoPersonaId)),
        nombre: form.value.nombre,
        tipoDocumento: Object(Number(this.selectedTipoDocumentoId)),
        numeroDocumento: form.value.numeroDocumento,
        pais: Number(this.selectedPaisId),
        departamento: Number(this.selectDepartamentoId),
        ciudad: Number(this.selectCiudadId),
        direccion: form.value.direccion,
        actividadEconomica: form.value.actividadEconomica,
        telefono: form.value.telefono,
        correo: form.value.correo,
      }
      console.log('Datos del formulario:', form.value.nombre);
      console.log('datos tipo persona:', persona);
    } else {
      console.log('Formulario inválido');
    }
  }
}
