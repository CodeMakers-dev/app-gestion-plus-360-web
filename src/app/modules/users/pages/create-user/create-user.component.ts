import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HeaderComponent } from '@components/header/header.component';
import { CityService } from '@modules/users/services/city.service';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { response } from 'express';
import { ICiudad, IDepartamento, IPais, IPersonCreate, IRol, ITipoDocumento, ITipoPersona } from '@core/interfaces/IuserById';
import { TypePersonService } from '@modules/users/services/typePerson.service';
import { TypeDocumentService } from '@modules/users/services/typeDocument.service';
import { DepartamentService } from '@modules/users/services/departament.service';
import { CountryService } from '../../services/country.service';
import { PersonService } from '../../services/person.service';
import { IPersona } from '../../../../core/interfaces/IuserById';
import { UserService } from '@modules/auth/service/user.service';
import { AuthService } from '@modules/auth/service/auth.service';
import Swal from 'sweetalert2';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { Router } from '@angular/router';
import { FooterComponent } from '@components/footer/footer.component';
import { RolService } from '@modules/users/services/rol.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule, NavigationComponent],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {

  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Usuarios', url: '/users' },
    { label: 'Crear Usuario', url: '/users/create-user' }
  ];

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

  rol:IRol[] = [];
  rolName:string[] = [];

  selectedTipoPersonaId: number | null = null;
  selectedTipoDocumentoId: number | null = null;
  selectedPaisId: number | null = null;
  selectDepartamentoId: number | null = null;
  selectCiudadId: number | null = null;

  selectRolId:number | null = null;

  constructor(
    private http: HttpClient,
    private cityService: CityService,
    private typePersonService: TypePersonService,
    private typeDocumentService: TypeDocumentService,
    private departamentService: DepartamentService,
    private countryService: CountryService,
    private personService: PersonService,
    private rolService: RolService,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadTiposPersona();
    this.loadTiposDocumento();
    this.loadPaises();
    this.loadDepartamentos();
    this.loadCiudades();
    this.loadRol();
  }
  loadRol(): void {
    this.rolService.getRol().subscribe((response) => {
      this.rol = response.response;
      this.rolName = response.response.map((tipoRol) => tipoRol.nombre)
    })
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
      const userId: number | null = localStorage.getItem("userId") 
        ? Number(localStorage.getItem("userId")) 
        : null;
  
      if (userId === null) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el usuario autenticado.",
        });
        return;
      }
  
      this.userService.getUserById(userId).subscribe(user => {
        console.log("ResponseGetPerson:", user.response.persona.nombre);
        
        const usuarioCreacion = user.response.persona.nombre; 
  
        const persona: IPersonCreate = {
          tipoPersona: { id: Number(this.selectedTipoPersonaId) },
          nombre: form.value.nombre,
          tipoDocumento: { id: Number(this.selectedTipoDocumentoId) },
          numeroDocumento: form.value.numeroDocumento,
          pais: { id: Number(this.selectedPaisId) },
          departamento: { id: Number(this.selectDepartamentoId) },
          ciudad: { id: Number(this.selectCiudadId) },
          direccion: form.value.direccion,
          actividadEconomica: form.value.actividadEconomica,
          telefono: form.value.telefono,
          correo: form.value.correo,
          usuarioCreacion: usuarioCreacion, 
          activo: false,
          imagen: "",
          rol: { id: Number(this.selectRolId) },
          fechaCreacion: new Date().toISOString(),
          usuarioModificacion: null,
          fechaModificacion: null
        };
  
        console.log("Datos del formulario:", persona);
  
        this.personService.createPersona(persona).subscribe({
          next: (response) => {
            Swal.fire({
              icon: "success",
              title: "Éxito",
              text: response.message || "La persona se ha creado correctamente.",
              showConfirmButton: false,
              timer: 2000
            });
            this.router.navigate(['/users']);
          },
          error: (error) => {
            const errorMessage = error.error?.mensaje || "Hubo un problema al crear la persona.";
            Swal.fire({
              icon: "error",
              title: "Error",
              text: errorMessage,
              confirmButtonText: "Intentar de nuevo",
            });
          }
        });
  
      }, error => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo obtener el usuario autenticado.",
        });
        console.error("Error al obtener el usuario:", error);
      });
  
    } else {
      Swal.fire({
        icon: "warning",
        title: "Formulario inválido",
        text: "Por favor, completa todos los campos requeridos.",
      });
    }
  }
  
}
