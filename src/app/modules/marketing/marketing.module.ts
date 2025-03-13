import { NgModule } from "@angular/core";
import { MarketingComponent } from "./pages/marketing/marketing.component";
import { CommonModule } from "@angular/common";
import { MarketingRoutingModule } from "./marketing-routing.module";
import { MensajesMasivosComponent } from "./components/mensajes-masivos/mensajes-masivos.component";
import { RouterModule } from "@angular/router";
import { routes } from "src/app/app.routes";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MarketingRoutingModule,
    MarketingComponent,
    MensajesMasivosComponent
  ],
  exports: [
    RouterModule,
    MensajesMasivosComponent
  ]
})
export class MarketingModule { }
