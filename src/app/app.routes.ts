import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './modules/dashboard/components/home/home.component';
import { NgModule } from '@angular/core';
import { LoginGuard } from './core/guards/login.guards';
import { RecoverPasswordComponent } from '@modules/auth/pages/recover-password/recover-password.component';
import { MarketingComponent } from '@modules/marketing/pages/marketing/marketing.component';
import { PasswordComponent } from '@modules/auth/pages/password/password.component';
import { UsersComponent } from './modules/users/pages/users/users.component';
import { CreatePasswordComponent } from '@modules/auth/pages/create-password/create-password.component';
import { HasRoleGuard } from '@core/guards/has-role.guard';


export const routes: Routes = [
  { path: 'create-password', component: CreatePasswordComponent },
  { path: 'password', component: PasswordComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'marketing',
    loadChildren: () => import('./modules/marketing/marketing.module').then(m => m.MarketingModule),
    canActivate: [AuthGuard],
    canMatch: [HasRoleGuard],
    data: { roles: ['ADMIN', 'CONSULTA'] }
  },
  {
    path: 'payments',
    loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule),
    canActivate: [AuthGuard],
    canMatch: [HasRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/user.module').then(m => m.UsersModule),
    canActivate: [AuthGuard],
    canMatch: [HasRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'messages',
    loadChildren: () => import('./modules/messages/messages.module').then(m => m.MessagesModule),
    canActivate: [AuthGuard],
    canMatch: [HasRoleGuard],
    data: { roles: ['ADMIN'] }
  },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
