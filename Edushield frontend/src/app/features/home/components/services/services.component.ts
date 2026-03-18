import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './services.component.html',
})
export class ServicesComponent {
  services = [
    {
      accentBar: 'bg-[#7E1546]',
      title: 'Child Education Planning',
      description: 'Helps parents secure funds for future education needs — from school fees to college admissions — with a disciplined savings plan.',
      highlights: ['Systematic savings', 'Goal-based plans', 'Inflation-protected'],
    },
    {
      accentBar: 'bg-[#D4AF37]',
      title: 'Flexible Premium Payments',
      description: 'Choose monthly, quarterly, or yearly payment options to fit your budget without compromising on coverage.',
      highlights: ['Monthly / Yearly', 'Auto-debit support', 'No penalty switches'],
    },
    {
      accentBar: 'bg-[#7E1546]',
      title: 'Guaranteed Maturity Benefits',
      description: 'Receive assured lump-sum funds when your child reaches college age, regardless of market conditions.',
      highlights: ['100% guaranteed', 'Bonus additions', 'Tax benefits u/s 80C'],
    },
    {
      accentBar: 'bg-[#D4AF37]',
      title: 'Fast Claim Assistance',
      description: 'Quick and easy claim processing with dedicated support. Most claims settled within 7 working days.',
      highlights: ['7-day settlement', 'Online tracking', '24/7 support'],
    },
  ];
}
