import { RouterModule, Routes } from "@angular/router";
import { MarketingComponent } from "./pages/marketing/marketing.component";
import { NgModule } from "@angular/core";
import { MensajesMasivosComponent } from "./pages/mensajes-masivos/mensajes-masivos.component";
import { CreateMessagesComponent } from "./pages/mass-messages/create-messages.component";
import { MessageHistoryComponent } from "./pages/message-history/message-history.component";

const routes: Routes = [
  { path: '', component: MarketingComponent },
  { path: 'mensajes-masivos', component: MensajesMasivosComponent },
  { path:'create-message',component: CreateMessagesComponent},
  { path: 'message-history', component: MessageHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule { }
