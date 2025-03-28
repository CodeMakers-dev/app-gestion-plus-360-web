import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../../../../core/components/header/header.component';
import { FooterComponent } from '../../../../core/components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { IPagos } from '@core/interfaces/Ipayments';
import { PaymentService } from '@modules/payments/services/payment.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommentPayService } from '@modules/payments/services/commentPay.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@modules/auth/service/user.service';
import { ICommentPay } from '@core/interfaces/IcommentPay';
import { ApiResponse } from '@core/interfaces/Iresponse';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    RouterModule,
    NavigationComponent,
    FormsModule,
  ],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css',
})
export class PaymentsComponent implements OnInit {
  navigationItems = [
    { label: 'Inicio', url: '/' },
    { label: 'Portal de Pagos', url: '/payments' },
  ];

  
  commentsList: any[] = [];
  newComment: string = '';
  showPopover: number | null = null;
  payments: IPagos[] = [];
  filteredPayments: IPagos[] = [];
  selectedColumns: string[] = [
    'Usuario',
    'tipoPlan',
    'valorPago',
    'fechaPago',
    'operacion',
  ];

  filterCriteria: { [key: string]: string } = {};
  activeFilters: { [key: string]: boolean } = {};
  columnFilters: { [key: string]: string } = {};
  paginaActual = 1;
  itemsPorPagina = 5;

  get datosPaginados() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    const fin = Math.min(
      inicio + this.itemsPorPagina,
      this.filteredPayments.length
    );
    return this.filteredPayments.slice(inicio, fin);
  }

  constructor(private paymentsService: PaymentService, private commentService: CommentPayService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }
 
  togglePopover(idPago: number) {
    if (this.showPopover === idPago) {
      this.showPopover = null;
    } else {
      this.showPopover = idPago;
      this.loadComments(idPago);
    }
  }

  loadComments(idPago: number) {
    this.commentService.getCommmentByPay(idPago).subscribe((comments: ApiResponse<ICommentPay[]>[]) => {
      console.log("Comentarios recibidos desde la API:", comments);

      if (Array.isArray(comments) && comments.length > 0 && Array.isArray(comments[0].response)) {
        this.commentsList = comments[0].response;
      } else {
        this.commentsList = [];
      }

      console.log("Lista de comentarios después de asignar:", this.commentsList);
      this.cdr.detectChanges();
    });
  }
  deleteComment(id: number, index: number): void {
    if (id === undefined || id === null) {
      console.error('ID de comentario no válido:', id);
      return;
    }

    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.commentsList.splice(index, 1);
        console.log(`Comentario con ID ${id} eliminado correctamente.`);
      },
      error: (error) => console.error('Error al eliminar el comentario:', error)
    });
  }
  saveComment(idPago: number) {
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

      if (this.newComment.trim() !== '') {
        const comentarioData = {
          pagos: { id: idPago },
          descripcion: this.newComment,
          usuarioCreacion: usuarioCreacion,
          activo: true
        };

        console.log("Enviando comentario:", comentarioData);

        this.commentService.saveComment(comentarioData).subscribe(() => {
          this.loadComments(idPago);
          this.newComment = '';
        });
      }
    });
  }


  totalPaginas(): number {
    return Math.ceil(this.filteredPayments.length / this.itemsPorPagina);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas()) {
      this.paginaActual = nuevaPagina;
    }
  }
 

  ngOnInit(): void {
    this.loadPayments();
  
  }

  loadPayments(): void {
    this.paymentsService.getPayments().subscribe((response) => {
      this.payments = response.response;
      this.payments = response.response.filter(
        (payment: any) => payment.activo === true
      );
      console.log('Payments Clg ------>', this.payments);
      this.filteredPayments = [...this.payments];
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredPayments = this.payments.filter(
      (payment) =>
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
    const data = this.filteredPayments.map((payment) => ({
      Nombre: payment.persona?.nombre || '',
      'Tipo de Plan': payment.tipoPlan?.nombre || '',
      'Valor de Pago': payment.valorPago || '',
      'Fecha de Pago': payment.fechaPago || '',
      'Origen de Pago': payment.origenPago?.nombre || '',
      'Destino de Pago': payment.destinoPago?.nombre || '',
      Referencia: payment.referencia || '',
      'Vigencia Desde': payment.vigenciaDesde || '',
      'Vigencia Hasta': payment.vigenciaHasta || '',
      'Días de Vigencia': payment.diasVigencia || '',
      Estado: payment.activo ? 'Activo' : 'Inactivo',
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pagos');

    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(dataBlob, 'Pagos.xlsx');
  }

  deletePayment(id: string, nombre?: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Desea eliminar el pago del usuario: " ${nombre} "?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.paymentsService.deletePayment(id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'El pago ha sido eliminado.', 'success');
            this.loadPayments();
          },
          error: () => {
            Swal.fire('Error', 'No se pudo eliminar el pago.', 'error');
          },
        });
      }
    });
  }

  toggleFilter(column: string) {
    this.activeFilters[column] = !this.activeFilters[column];
    if (!this.activeFilters[column]) {
      delete this.columnFilters[column];
      this.applyAllFilters();
    }
  }

  applyColumnFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.columnFilters[column] = filterValue;
    this.applyAllFilters();
  }

  applyAllFilters() {
    this.filteredPayments = this.payments.filter((payment) => {
      return Object.keys(this.columnFilters).every((column) => {
        const value = this.getColumnValue(payment, column);
        return value.includes(this.columnFilters[column]);
      });
    });
  }

  getColumnValue(payment: IPagos, column: string): string {
    switch (column) {
      case 'persona':
        return payment.persona?.nombre?.toLowerCase() || '';
      case 'tipoPlan':
        return payment.tipoPlan?.nombre?.toLowerCase() || '';
      case 'valorPago':
        return payment.valorPago?.toString().toLowerCase() || '';
      case 'fechaPago':
        return payment.fechaPago?.toString().toLowerCase() || '';
      case 'origenPago':
        return payment.origenPago?.nombre?.toLowerCase() || '';
      case 'destinoPago':
        return payment.destinoPago?.nombre?.toLowerCase() || '';
      case 'referencia':
        return payment.referencia?.toLowerCase() || '';
      case 'vigenciaDesde':
        return payment.vigenciaDesde?.toString().toLowerCase() || '';
      case 'vigenciaHasta':
        return payment.vigenciaHasta?.toString().toLowerCase() || '';
      case 'diasVigencia':
        return payment.diasVigencia?.toString().toLowerCase() || '';
      case 'activo':
        return payment.activo ? 'activo' : 'inactivo';
      default:
        return '';
    }
  }

  // Detectar clics fuera del popover
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const popoverElement = document.getElementById('popover');
    if (popoverElement && !popoverElement.contains(event.target as Node)) {
      this.showPopover = null;
      this.cdr.detectChanges();
    }
  }
}
