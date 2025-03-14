import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './modules/dashboard/components/home/home.component';
import { NgModule } from '@angular/core';
import { LoginGuard } from './core/guards/login.guards';
import { RecoverPasswordComponent } from '@modules/auth/pages/recover-password/recover-password.component';
import { MarketingComponent } from '@modules/marketing/pages/marketing/marketing.component';
import { PasswordComponent } from '@modules/auth/pages/password/password.component';
import { CreatePasswordComponent } from '@modules/auth/pages/create-password/create-password.component';


export const routes: Routes = [
  { path: 'create-password', component: CreatePasswordComponent},
  { path: 'password', component: PasswordComponent },
  { path: 'recover-password', component: RecoverPasswordComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'marketing', loadChildren: () => import('./modules/marketing/marketing.module').then(m => m.MarketingModule), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
