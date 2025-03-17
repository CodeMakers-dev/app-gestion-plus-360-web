import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from '@components/navigation/navigation.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  exports: [BreadcrumbComponent]
})
export class SharedModule { }