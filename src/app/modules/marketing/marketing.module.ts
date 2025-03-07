import { NgModule } from "@angular/core";
import { MarketingComponent } from "./pages/marketing/marketing.component";
import { CommonModule } from "@angular/common";
import { MarketingRoutingModule } from "./marketing-routing.module";
import { MensajesMasivosComponent } from "./components/mensajes-masivos/mensajes-masivos.component";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    MarketingComponent,
    MensajesMasivosComponent
  ],
  exports: [
    MensajesMasivosComponent
  ]
})
export class MarketingModule { }
