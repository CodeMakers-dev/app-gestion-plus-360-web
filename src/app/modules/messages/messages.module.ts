import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MessagesComponent } from "./pages/messages/messages.component";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MessagesRoutingModule } from "./messages-routing.module";

const routes: Routes = [
  { path: '', component: MessagesComponent }
];

  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      MessagesComponent,
      RouterModule.forChild(routes),
      FormsModule,
      MessagesRoutingModule
    ],
    exports: [RouterModule]
  })
  export class MessagesModule { }