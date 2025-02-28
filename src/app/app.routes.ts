import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './components/home/home.component';
import { MarketingComponent } from './pages/marketing/marketing.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  {path:'marketing',component:MarketingComponent,canActivate:[AuthGuard]},
  { path: '**', redirectTo: 'login' }, 
];
