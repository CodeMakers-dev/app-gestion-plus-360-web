import { Component } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { Router } from '@angular/router';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { FooterComponent } from '@components/footer/footer.component';

@Component({
  selector: 'app-marketing',
  standalone: true,
  imports: [HeaderComponent, NavigationComponent, FooterComponent],
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css']
})
export class MarketingComponent {
  navigationItems = [
    { label: 'Home', url: '/' },
    { label: 'Marketing', url: '/marketing' }
  ];

  constructor(private router: Router) {}

  navegarMensajesMasivos() {
    this.router.navigate(['marketing/mensajes-masivos']);
  }
}
