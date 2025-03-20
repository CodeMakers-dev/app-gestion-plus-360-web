import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentsComponent } from './pages/payments/payments.component';
import { CreatePayComponent } from './pages/create-pay/create-pay.component';
import { RouterModule, Routes } from '@angular/router';
import { EditPayComponent } from './pages/edit-pay/edit-pay.component';


const routes: Routes = [
  { path: '', component: PaymentsComponent },
  { path: 'create-pay', component: CreatePayComponent },
  { path: 'edit-pay/:id', component: EditPayComponent }
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
