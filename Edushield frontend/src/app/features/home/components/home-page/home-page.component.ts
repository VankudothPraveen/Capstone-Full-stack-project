import { Component } from '@angular/core';
import { HomeNavbarComponent } from '../home-navbar/home-navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { ServicesComponent } from '../services/services.component';
import { CoverageComponent } from '../coverage/coverage.component';
import { TailoredPlansComponent } from '../tailored-plans/tailored-plans.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { QuoteComponent } from '../quote/quote.component';
import { HomeFooterComponent } from '../home-footer/home-footer.component';
import { SentimentalImpactComponent } from '../sentimental-impact/sentimental-impact.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    HomeNavbarComponent,
    HeroComponent,
    ServicesComponent,
    CoverageComponent,
    TailoredPlansComponent,
    SentimentalImpactComponent,
    TestimonialsComponent,
    QuoteComponent,
    HomeFooterComponent,
  ],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {}
