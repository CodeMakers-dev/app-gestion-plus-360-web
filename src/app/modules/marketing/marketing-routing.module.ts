import { RouterModule, Routes } from "@angular/router";
import { MarketingComponent } from "./pages/marketing/marketing.component";
import { NgModule } from "@angular/core";
import { MensajesMasivosComponent } from "./components/mensajes-masivos/mensajes-masivos.component";

const routes: Routes = [
  { path: '', component: MarketingComponent },
  { path: 'mensajes-masivos', component: MensajesMasivosComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
