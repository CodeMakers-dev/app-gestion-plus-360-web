import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '@components/footer/footer.component';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent,FooterComponent],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
