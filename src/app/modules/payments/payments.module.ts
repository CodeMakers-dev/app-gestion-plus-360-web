import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './pages/payments/payments.component';
import { CreatePayComponent } from './pages/create-pay/create-pay.component';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', component: PaymentsComponent },
  { path: 'create-pay', component: CreatePayComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PaymentsComponent,
    CreatePayComponent,
    PaymentsRoutingModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PaymentsModule { }
