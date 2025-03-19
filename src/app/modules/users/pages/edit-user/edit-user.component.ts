import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { ICiudad, IDepartamento, IPais, IPersonCreate, ITipoDocumento, ITipoPersona } from '@core/interfaces/IuserById';
import { CityService } from '@modules/users/services/city.service';
import { CountryService } from '@modules/users/services/country.service';
import { DepartamentService } from '@modules/users/services/departament.service';
import { PersonService } from '@modules/users/services/person.service';
import { TypeDocumentService } from '@modules/users/services/typeDocument.service';
import { TypePersonService } from '@modules/users/services/typePerson.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NavigationComponent],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Usuarios', url: '/users' },
    { label: 'Editar Usuario', url: '/users/edit-user' }
  ];

  userForm: FormGroup;
  id!: number;
  userId?: number;

  tiposPerson: ITipoPersona[] = [];
  tiposPersonName: string[] = [];
  typeDocument: ITipoDocumento[] = [];
  typeDocumentName: string[] = [];
  country: IPais[] = [];
  paises: string[] = [];
  departamento: IDepartamento[] = [];
  departamentName: string[] = [];
  ciudad: ICiudad[] = [];
  ciudadName: string[] = [];

  selectedTipoPersonaId!: string;
  selectedTipoDocumentoId!: string;
  selectedPaisId!: string;
  selectDepartamentoId!: string;
  selectCiudadId!: string;

  persona: IPersonCreate = {
    tipoPersona: { id: 0 },
    nombre: '',
    tipoDocumento: { id: 0 },
    numeroDocumento: '',
    pais: { id: 0 },
    departamento: { id: 0 },
    ciudad: { id: 0 },
    direccion: '',
    actividadEconomica: '',
    telefono: '',
    correo: '',
    usuarioCreacion: '',
    activo: false,
    imagen: '',
    fechaCreacion: '',
    usuarioModificacion: null,
    fechaModificacion: null
  };

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService,
    private fb: FormBuilder,
    private router: Router,
    private typePersonService: TypePersonService,
    private typeDocumentService: TypeDocumentService,
    private countryService: CountryService,
    private departamentService: DepartamentService,
    private cityService: CityService
  ) {
    this.userForm = this.fb.group({
      numeroDocumento: [''],
      nombre: [''],
      tipoDocumento: [''],
      tipoPersona: [''],
      pais: [''],
      departamento: [''],
      ciudad: [''],
      direccion: [''],
      actividadEconomica: [''],
      telefono: [''],
      correo: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log("ID obtenido de la URL:", id);

      if (id) {
        this.userId = id;
        this.cargarPersona(id);
      } else {
        console.warn("No se encontró ID en la URL");
      }
    });

    this.userForm = this.fb.group({
      numeroDocumento: [''],
      nombre: [''],
      tipoDocumento: [''],
      tipoPersona: [''],
      pais: [''],
      departamento: [''],
      ciudad: [''],
      direccion: [''],
      actividadEconomica: [''],
      telefono: [''],
      correo: ['']
    });

    this.loadTiposPersona();
    this.loadTiposDocumento();
    this.loadPaises();
    this.loadDepartamentos();
    this.loadCiudades();
  }

  cargarPersona(id: number): void {
    console.log("Cargando persona con ID:", id);
    this.personService.getPersonById(id).subscribe(response => {
      console.log("Respuesta del servicio:", response);
      if (response && response.response) {
        this.persona = response.response;
        console.log("Persona cargada:", this.persona);
        this.userId = this.persona.id;
        this.userForm.patchValue({
          numeroDocumento: this.persona.numeroDocumento,
          nombre: this.persona.nombre,
          tipoDocumento: this.persona.tipoDocumento.id,
          tipoPersona: this.persona.tipoPersona.id,
          pais: this.persona.pais.id,
          departamento: this.persona.departamento.id,
          ciudad: this.persona.ciudad.id,
          direccion: this.persona.direccion,
          actividadEconomica: this.persona.actividadEconomica,
          telefono: this.persona.telefono,
          correo: this.persona.correo
        })
        console.log("Valores del formulario:", this.userForm.value);
      } else {
        console.warn("La respuesta no contiene datos válidos");
      }
    }, error => {
      console.error("Error al cargar persona:", error);
    });
  }

  loadTiposPersona(): void {
    this.typePersonService.getTypePerson().subscribe((response) => {
      console.log("Tipos de Persona Response:", response);
      this.tiposPerson = response.response || [];
      this.tiposPersonName = this.tiposPerson.map(tipoPersona => tipoPersona.nombre);
    });
  }

  loadTiposDocumento(): void {
    this.typeDocumentService.getAllTypeDocument().subscribe((response) => {
      console.log("Tipos de Documento Response:", response);
      this.typeDocument = response.response || [];
      this.typeDocumentName = this.typeDocument.map(tipoDocumento => tipoDocumento.nombre);
    });
  }

  loadPaises(): void {
    this.countryService.getAllCountry().subscribe((response) => {
      console.log("Países Response:", response);
      this.country = response.response || [];
      this.paises = this.country.map(pais => pais.nombre);
    });
  }

  loadDepartamentos(): void {
    this.departamentService.getAllDepartament().subscribe((response) => {
      console.log("Departamentos Response:", response);
      this.departamento = response.response || [];
      this.departamentName = this.departamento.map(departamento => departamento.nombre);
    });
  }

  loadCiudades(): void {
    this.cityService.getCity().subscribe((response) => {
      console.log("Ciudades Response:", response);
      this.ciudad = response.response || [];
      this.ciudadName = this.ciudad.map(ciudad => ciudad.nombre);
    });
  }

  transformarDatos(formData: any): any {
    return {
      tipoPersona: { id: Number(formData.tipoPersona) },
      nombre: formData.nombre,
      tipoDocumento: { id: Number(formData.tipoDocumento) },
      numeroDocumento: formData.numeroDocumento,
      pais: { id: Number(formData.pais) },
      departamento: { id: Number(formData.departamento) },
      ciudad: { id: Number(formData.ciudad) },
      direccion: formData.direccion,
      actividadEconomica: formData.actividadEconomica,
      telefono: formData.telefono,
      correo: formData.correo
    };
  }

  onSubmit(form: FormGroup): void {
    if (form.valid) {
      console.log("Formulario válido. Datos a enviar:", form.value);

      if (this.userId === undefined) {
        alert('No se pudo actualizar porque el ID es inválido.');
        return;
      }

      const datosTransformados = this.transformarDatos(form.value);
      console.log("Datos transformados:", datosTransformados);

      this.personService.updateUser(this.userId, datosTransformados).subscribe({
        next: (response) => {
                Swal.fire({
                  title: "Usuario Actualizado",
                  text: response.message,
                  icon: "success"
                });
                this.router.navigate(['/users']);
              },
              error: (err) => {
                console.error("Error al bloquear usuario:", err);
                Swal.fire({
                  title: "Error",
                  text: err.message,
                  icon: "error"
                });
              }
      });
    } else {
      console.warn("Formulario inválido");
    }
  }
}
