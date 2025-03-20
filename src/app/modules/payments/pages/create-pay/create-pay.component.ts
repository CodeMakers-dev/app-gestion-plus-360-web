import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import moment from 'moment';
import {  IDestinoPago, IOrigenPago, IPersona, ITipoPlan, IUsuario } from '@core/interfaces/Ipayments';
import { CommonModule } from '@angular/common';
import { ApiResponse } from '@core/interfaces/Iresponse';
import { TypePlanService } from '@modules/payments/services/typePlan.service';
import { OriginPaymentService } from '@modules/payments/services/originPayment.service';
import { DestinationPaymentService } from '@modules/payments/services/destinationPayment.service';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { PaymentService } from '@modules/payments/services/payment.service';
import Swal from 'sweetalert2';
import { AuthService } from '@modules/auth/service/auth.service';
import { UserService } from '@modules/auth/service/user.service';
import { Router } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';


@Component({
  selector: 'app-create-pay',
  standalone: true,
  imports: [ReactiveFormsModule, HeaderComponent, FooterComponent,NavigationComponent, CommonModule],
  templateUrl: './create-pay.component.html',
  styleUrl: './create-pay.component.css'
}) 
export class CreatePayComponent {
  pagoForm!: FormGroup;
  usuarios: IUsuario[] = [];
  typePlan: ITipoPlan[] = [];
  originPayment: IOrigenPago[] = [];
  destinationPayment: IDestinoPago[] = [];
  
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Portal de pagos', url: '/payments' },
    { label: 'crear pago', url: '/create-pay'}
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private typePlanService: TypePlanService,
    private originPaymentService: OriginPaymentService,
    private destinationPaymentService: DestinationPaymentService,
    private paymentService: PaymentService,
    private router: Router,
     ) {}

  ngOnInit() {

    
    this.pagoForm = this.fb.group({
      usuario: [''],
      tipoPlan: [''],
      valorPago: [''],
      origenPago: [''],
      destinoPago: [''],
      referencia: [''],
      fechaPago: [''],
      vigenciaDesde: [''],
      vigenciaHasta: [''],
      diasVigencia: [{ value: '', disabled: true }]
    });

    this.pagoForm.get('vigenciaDesde')?.valueChanges.subscribe(() => this.
    calculateDaysOfValidity());
    this.pagoForm.get('vigenciaHasta')?.valueChanges.subscribe(() => this.
    calculateDaysOfValidity());
    this.sendUsers();
    this.sendTypePlan();
    this.sendOriginPayment();
    this.sendDestinationPayment();
  }
  sendUsers() {
    this.userService.getUsers().subscribe((data: ApiResponse<IUsuario[]>) => {
      this.usuarios = data.response; 
    });
  }
  sendTypePlan() {
    this.typePlanService.getAllTypePlan().subscribe((data: ApiResponse<ITipoPlan[]>) => {
      this.typePlan = data.response; 
    });
  }
  sendOriginPayment(){
    this.originPaymentService.getAllOriginPayment().subscribe((data: ApiResponse<IOrigenPago[]>) => {
      this.originPayment = data.response; 
    });
  }
  sendDestinationPayment(){
    this.destinationPaymentService.getAllDestinationPayment().subscribe((data: ApiResponse<IDestinoPago[]>) => {
      this.destinationPayment = data.response; 
    });
  } 
  calculateDaysOfValidity() {
    const desde = this.pagoForm.get('vigenciaDesde')?.value;
    const hasta = this.pagoForm.get('vigenciaHasta')?.value;
  
    if (desde && hasta) {
      const fechaDesde = moment(desde, 'YYYY-MM-DD', true);
      const fechaHasta = moment(hasta, 'YYYY-MM-DD', true);
      if (fechaDesde.isValid() && fechaHasta.isValid()) {
        const diff = fechaHasta.diff(fechaDesde, 'days');
        this.pagoForm.get('diasVigencia')?.enable();
        this.pagoForm.get('diasVigencia')?.setValue(diff >= 0 ? diff : 0);
      } else {
        console.error("Formato de fecha inválido:", { desde, hasta });
      }
    } else {
      console.warn("Fechas no definidas:", { desde, hasta });
    }
  }
  onSubmit() {
    if (this.pagoForm.valid) {
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
        const usuarioCreacion = user.response.persona.nombre;
  
        const formData = {
          persona: { id: this.pagoForm.value.usuario }, 
          tipoPlan: { id: this.pagoForm.value.tipoPlan },
          origenPago: { id: this.pagoForm.value.origenPago },
          destinoPago: { id: this.pagoForm.value.destinoPago },
          valorPago: this.pagoForm.value.valorPago,
          referencia: this.pagoForm.value.referencia,
          fechaPago: this.pagoForm.value.fechaPago,
          vigenciaDesde: this.pagoForm.value.vigenciaDesde,
          vigenciaHasta: this.pagoForm.value.vigenciaHasta,
          diasVigencia: this.pagoForm.value.diasVigencia,
          usuarioCreacion: usuarioCreacion, 
          activo: true
        };
  
        this.paymentService.createPayment(formData).subscribe({
          next: (response) => {
            Swal.fire({
              icon: 'success',
              title: 'Pago registrado',
              text: 'El pago ha sido registrado correctamente.',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/payments']);
            });
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Ocurrió un error al registrar el pago. Inténtalo de nuevo.',
              confirmButtonColor: '#d33',
              confirmButtonText: 'Cerrar'
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
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, completa todos los campos requeridos.',
        confirmButtonColor: '#f39c12',
        confirmButtonText: 'Entendido'
      });
    }
  }  
}
