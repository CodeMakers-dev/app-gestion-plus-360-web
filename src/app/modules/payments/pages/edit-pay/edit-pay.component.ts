import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '@modules/payments/services/payment.service';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import { IDestinoPago, IOrigenPago, ITipoPlan } from '@core/interfaces/Ipayments';

@Component({
  selector: 'app-edit-pay',
  imports: [HeaderComponent, NavigationComponent, CommonModule, ReactiveFormsModule, FooterComponent],
  templateUrl: './edit-pay.component.html',
  styleUrl: './edit-pay.component.css'
})
export class EditPayComponent implements OnInit {
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Portal de pagos', url: '/payments' },
    { label: 'Editar pago', url: '/payments/edit-pay' }
  ];

  editPaymentForm!: FormGroup;
  paymentId!: string;
  typePlan: ITipoPlan[] = [];
  originPayment: IOrigenPago[] = [];
  destinationPayment: IDestinoPago[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id')!;

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
      diasVigencia: [{ value: '', disabled: true }]
    });

    this.loadPaymentData();
  }

  loadPaymentData(): void {
    this.paymentService.getPaymentById(this.paymentId).subscribe(payment => {
      console.log('Datos recibidos:', payment); 
  
      if (payment?.success && payment.response) {
        const data = payment.response;
        
        this.editPaymentForm.patchValue({
          usuario: data.persona ? data.persona.nombre : '',
          tipoPlan: data.tipoPlan ? data.tipoPlan.nombre : '',
          valorPago: data.valorPago,
          fechaPago: data.fechaPago,
          origenPago: data.origenPago ? data.origenPago.nombre : '',
          destinoPago: data.destinoPago ? data.destinoPago.nombre : '',
          referencia: data.referencia,
          vigenciaDesde: data.vigenciaDesde,
          vigenciaHasta: data.vigenciaHasta,
          diasVigencia: data.diasVigencia
        });
  
       
        this.editPaymentForm.get('usuario')?.enable();
      }
    }, error => {
      console.error('Error al cargar los datos del pago:', error);
    });
  }
  
  saveChanges(): void {
    if (this.editPaymentForm.valid) {
      this.paymentService.updatePayment(this.paymentId, this.editPaymentForm.value).subscribe(() => {
        alert('Pago actualizado correctamente');
        this.router.navigate(['/payments']);
      });
    }
  }
}