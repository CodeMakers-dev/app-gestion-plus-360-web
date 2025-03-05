import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './modules/dashboard/components/home/home.component';
import { MarketingComponent } from './pages/marketing/marketing.component';
import { NgModule } from '@angular/core';
import { LoginGuard } from './core/guards/login.guards';


export const routes: Routes = [

  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {path:'marketing',component:MarketingComponent,canActivate:[AuthGuard]},
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
