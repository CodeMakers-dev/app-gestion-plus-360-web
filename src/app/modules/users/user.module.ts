import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./pages/users/users.component";
import { UsersRoutingModule } from "./user-routing.module";
import { RouterModule, Routes } from "@angular/router";
import { CreateUserComponent } from "./pages/create-user/create-user.component";
import { EditUserComponent } from "./pages/edit-user/edit-user.component";
import { FormsModule } from "@angular/forms";
  
const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: 'create-user', component: CreateUserComponent },
  { path: 'edit-user/:id', component: EditUserComponent }
];

  @NgModule({
    declarations: [],
    imports: [
      CommonModule,
      UsersComponent,
      CreateUserComponent,
      UsersRoutingModule,
      EditUserComponent,
      RouterModule.forChild(routes),
      FormsModule
    ],
    exports: [RouterModule]
  })
  export class UsersModule { }