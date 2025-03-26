import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from '@modules/payments/services/payment.service';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import { IDestinoPago, IOrigenPago, IPagos, IPagosCreate, IPersona, ITipoPlan } from '@core/interfaces/Ipayments';
import { TypePlanService } from '@modules/payments/services/typePlan.service';
import { OriginPaymentService } from '@modules/payments/services/originPayment.service';
import { DestinationPaymentService } from '@modules/payments/services/destinationPayment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-pay',
  imports: [HeaderComponent, NavigationComponent, CommonModule, ReactiveFormsModule, FooterComponent,RouterModule],
  templateUrl: './edit-pay.component.html',
  styleUrl: './edit-pay.component.css'
})
export class EditPayComponent implements OnInit {
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Portal de Pagos', url: '/payments' },
    { label: 'Editar Pago', url: '/payments/edit-pay' }
  ];
  editPaymentForm: FormGroup;
  id!: number;
  paymentId?: number;

  payments: IPagos[] = [];

  person: IPersona[] = [];
  tipoPerson:string[] = [];

  typePlan: ITipoPlan[] = [];
  tipoPlan:string[]=[];

  originPayment: IOrigenPago[] = [];
  tipoOrigen:string[] = [];

  destinationPayment: IDestinoPago[] = [];
  tipoDestino:string[] = [];

  selectedTipoPlan!: string;
  selectedOrigenPago!:string;
  selectedDestinoPago!:string;

  pagos: IPagosCreate = {
      persona:{ id: 0, nombre: '' },
      tipoPlan: { id: 0 },
      origenPago: { id: 0 },
      destinoPago: { id: 0 },
      valorPago: 0,
      referencia: '',
      fechaPago: new Date(),
      vigenciaDesde: new Date(),
      vigenciaHasta: new Date(),
      diasVigencia: '',
      activo: true,
      usuarioCreacion: '',
      fechaCreacion: '',
      usuarioModificacion: null,
      fechaModificacion: null
    };
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private typePlanService: TypePlanService,
    private originPaymentService: OriginPaymentService,
    private destinationPaymentService: DestinationPaymentService
  ) {
      this.editPaymentForm = this.fb.group({
        usuario: [''],
        tipoPlan: [''],
        origenPago: [''],
        destinoPago: [''],
        valorPago: [''],
        referencia: [''],
        fechaPago:  [''],
        vigenciaDesde: [''],
        vigenciaHasta: [''],
        diasVigencia: [''],
      });
    
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      console.log("ID obtenido de la URL:", id);

      if (id) {
        this.paymentId = id;
        this.loadPaymentData(id);
      } else {
        console.warn("No se encontró ID en la URL");
      }
    });

    this.editPaymentForm = this.fb.group({
      usuario: [{ value: '', disabled: true }],
      tipoPlan: [''],
      valorPago: [''],
      origenPago: [''],
      destinoPago: [''],
      referencia: [''],
      fechaPago: [''],
      vigenciaDesde: [''],
      vigenciaHasta: [''],
      diasVigencia: ['']
    });

    this.loadTypePayment();
    this.loadOriginPayment();
    this.loadDestinationPayment();

  }

  loadPaymentData(id: number): void {
    this.paymentService.getPaymentById(id).subscribe(response => {
      if (response && response.response) {
        this.pagos = response.response;
        console.log("Persona cargada:", this.pagos);
        this.paymentId = this.pagos.id;
        this.editPaymentForm.patchValue({
          usuario: this.pagos.persona.nombre,
          tipoPlan: this.pagos.tipoPlan.id,
          origenPago: this.pagos.origenPago.id,
          destinoPago: this.pagos.destinoPago.id,
          valorPago: this.pagos.valorPago,
          referencia: this.pagos.referencia,
          fechaPago: this.pagos.fechaPago,
          vigenciaDesde: this.pagos.vigenciaDesde,
          vigenciaHasta: this.pagos.vigenciaHasta,
          diasVigencia: this.pagos.diasVigencia,
        })
        console.log("Valores del formulario:", this.editPaymentForm.value);
      } else {
        console.warn("La respuesta no contiene datos válidos");
      }
    }, error => {
      console.error("Error al cargar persona:", error);
    });
  }
  loadTypePayment(): void {
    this.typePlanService.getAllTypePlan().subscribe((response) => {
      this.typePlan = response.response || [];
      this.tipoPerson = this.person.map(tipoPersona => tipoPersona.nombre);
    });
  }

  loadOriginPayment(): void {
    this.originPaymentService.getAllOriginPayment().subscribe((response) => {
      this.originPayment = response.response || [];
      this.tipoOrigen = this.originPayment.map(originPayment => originPayment.nombre);
    });
  }

  loadDestinationPayment(): void {
    this.destinationPaymentService.getAllDestinationPayment().subscribe((response) => {
      this.destinationPayment = response.response || [];
      this.tipoDestino = this.destinationPayment.map(destinationPayment => destinationPayment.nombre);
    });
  }

  transformarDatos(formData: any): any {
    return {
      person: { id: Number(formData.persona) },
      tipoPlan: { id: Number(formData.tipoPlan) },
      origePago: { id: Number(formData.origenPago) },
      detinoPago:{ id: Number(formData.destinoPago) },
      referencia: formData.referencia,
      fechaPago: formData.fechaPago,
      vigenciaDesde: formData.vigenciaDesde,
      vigenciaHasta: formData.vigenciaHasta,
      diasVigencia: formData.diasVigencia,
    };
  }

   onSubmit(form: FormGroup): void {
      if (form.valid) {
        console.log("Formulario válido. Datos a enviar:", form.value);
  
        if (this.paymentId === undefined) {
          alert('No se pudo actualizar porque el ID es inválido.');
          return;
        }
  
        const datosTransformados = this.transformarDatos(form.value);
        console.log("Datos transformados:", datosTransformados);
  
        this.paymentService.updatePayment(this.paymentId, datosTransformados).subscribe({
          next: (response) => {
                  Swal.fire({
                    title: "Pago Actualizado",
                    text: response.message,
                    icon: "success"
                  });
                  this.router.navigate(['/payments']);
                },
        });
      } else {
        console.warn("Formulario inválido");
      }
    }
}