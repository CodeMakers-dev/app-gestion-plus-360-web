import { RouterModule, Routes } from "@angular/router";
import { MarketingComponent } from "./pages/marketing/marketing.component";
import { NgModule } from "@angular/core";
import { MensajesMasivosComponent } from "./components/mensajes-masivos/mensajes-masivos.component";
import { CreateMessagesComponent } from "./components/mass-messages/create-messages.component";

const routes: Routes = [
  { path: '', component: MarketingComponent },
  { path: 'mensajes-masivos', component: MensajesMasivosComponent },
  { path:'create-message',component: CreateMessagesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
