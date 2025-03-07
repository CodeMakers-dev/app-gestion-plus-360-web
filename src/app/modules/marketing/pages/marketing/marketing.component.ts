import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.css'
})
export class MarketingComponent {
  constructor(private router: Router) {}

  navegarMensajesMasivos() {
    this.router.navigate(['marketing/mensajes-masivos']);
  }
}
