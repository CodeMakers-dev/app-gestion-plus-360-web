import { Component } from '@angular/core';
import { HeaderComponent } from "../../../../core/components/header/header.component";
import { FooterComponent } from "../../../../core/components/footer/footer.component";
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,RouterModule],
  templateUrl: './payments.component.html',
  styleUrl: './payments.component.css'
})
export class PaymentsComponent {

}
