import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./pages/users/users.component";
import { UsersRoutingModule } from "./user-routing.module";
import { RouterModule, Routes } from "@angular/router";
import { CreateUserComponent } from "./pages/create-user/create-user.component";
  
const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'create-user', component: CreateUserComponent }
];

  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      UsersComponent,
      CreateUserComponent,
      UsersRoutingModule,
      RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
  })
  export class UsersModule { }