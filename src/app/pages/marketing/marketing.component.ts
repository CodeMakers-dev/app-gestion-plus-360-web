import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { FooterComponent } from '../../core/components/footer/footer.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketing',
  imports: [HeaderComponent],
  templateUrl: './marketing.component.html',
  styleUrl: './marketing.component.css'
})
export class MarketingComponent {
  constructor(private router: Router) {}

  navegarMensajesMasivos() {
    this.router.navigate(['/mensajes-masivos']);
  }
}
