import { Component, HostListener, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { IPagos } from '@core/interfaces/Ipayments';
import { PaymentService } from '@modules/payments/services/payment.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, RouterModule, NavigationComponent,FormsModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent implements OnInit{
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Portal de pagos', url: '/payments' }
  ];
  constructor(private paymentsService: PaymentService) { }

  payments: IPagos[] = [];
  filteredPayments: IPagos[] = [];
  selectedColumns: string[] = ['Usuario', 'tipoPlan', 'valorPago', 'fechaPago', 'operacion'];
 
  ngOnInit(): void {
    this.loadPayments();
  } 

  loadPayments(): void {
    this.paymentsService.getPayments().subscribe((response) => {
      this.payments = response.response;
      this.payments = response.response.filter((payment: any) => payment.activo === true);
      console.log("Payments Clg ------>", this.payments);
      this.filteredPayments = [...this.payments];
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
  
    this.filteredPayments = this.payments.filter(payment =>
      payment.persona?.nombre?.toLowerCase().includes(filterValue) ||
      payment.tipoPlan?.nombre?.toLowerCase().includes(filterValue) ||
      payment.valorPago?.toString().toLowerCase().includes(filterValue) ||
      payment.fechaPago?.toString().toLowerCase().includes(filterValue) ||
      payment.origenPago?.nombre?.toLowerCase().includes(filterValue) ||
      payment.destinoPago?.nombre?.toLowerCase().includes(filterValue) ||
      payment.referencia?.toLowerCase().includes(filterValue) ||
      payment.vigenciaDesde?.toString().toLowerCase().includes(filterValue) ||
      payment.vigenciaHasta?.toString().toLowerCase().includes(filterValue) ||
      payment.diasVigencia?.toString().toLowerCase().includes(filterValue) ||
      (payment.activo ? 'activo' : 'inactivo').includes(filterValue)
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

  toggleDropdown() {
    const dropdown = document.getElementById('dropdownAction');
    if (dropdown) {
      dropdown.classList.toggle('show');
    }
  }

  isColumnSelected(column: string): boolean {
    return this.selectedColumns.includes(column);
  }

  exportToExcel() {
    const data = this.filteredPayments.map(payment => ({
      'Nombre': payment.persona?.nombre || '',
      'Tipo de Plan': payment.tipoPlan?.nombre || '',
      'Valor de Pago': payment.valorPago || '',
      'Fecha de Pago': payment.fechaPago || '',
      'Origen de Pago': payment.origenPago?.nombre || '',
      'Destino de Pago': payment.destinoPago?.nombre || '',
      'Referencia': payment.referencia || '',
      'Vigencia Desde': payment.vigenciaDesde || '',
      'Vigencia Hasta': payment.vigenciaHasta || '',
      'Días de Vigencia': payment.diasVigencia || '',
      'Estado': payment.activo ? 'Activo' : 'Inactivo'
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');
  
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'Pagos.xlsx');
  }
 
  
  
}
