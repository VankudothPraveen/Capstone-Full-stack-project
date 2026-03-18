import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  templateUrl: './testimonials.component.html',
})
export class TestimonialsComponent {
  stats = [
    { value: '50K+', label: 'Happy Families' },
    { value: '₹25Cr+', label: 'Claims Settled' },
    { value: '98%', label: 'Renewal Rate' },
    { value: '15+', label: 'Years of Trust' },
  ];
}
