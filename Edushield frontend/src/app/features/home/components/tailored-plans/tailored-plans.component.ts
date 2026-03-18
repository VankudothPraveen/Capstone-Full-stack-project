import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tailored-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tailored-plans.component.html',
})
export class TailoredPlansComponent {
  steps = [
    {
      number: '01',
      title: 'Enter Child Details',
      description: 'Provide your child\'s name, date of birth, and school information to personalise the plan.',
    },
    {
      number: '02',
      title: 'Choose Education Goal',
      description: 'Select the education milestone — engineering, medicine, MBA — and set the target corpus.',
    },
    {
      number: '03',
      title: 'Get Personalised Plan',
      description: 'Our smart engine recommends the best insurance plan matching your goal and budget instantly.',
    },
  ];

  scrollToQuote(): void {
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
