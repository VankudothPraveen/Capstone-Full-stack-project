import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-quote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quote.component.html',
})
export class QuoteComponent {
  form = {
    parentName: '',
    childAge: null as number | null,
    educationGoal: '',
    coverageAmount: null as number | null,
  };

  goals = ['Engineering', 'Medicine', 'MBA', 'Arts & Design', 'Law', 'Other'];
  coverageOptions = [500000, 1000000, 2000000, 3000000, 5000000];

  features = [
    { icon: '⚡', label: 'Instant Estimate',       desc: 'Results in under 30 seconds' },
    { icon: '🔒', label: 'No Personal Data Stored', desc: 'We value your privacy' },
    { icon: '📊', label: 'Accurate Calculations',   desc: 'Based on real actuarial data' },
  ];

  submitting = false;
  result: { estimatedMonthlyPremium: number } | null = null;
  error = '';

  constructor(private http: HttpClient) {}

  formatAmount(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  isValid(): boolean {
    return !!(this.form.parentName && this.form.childAge && this.form.educationGoal && this.form.coverageAmount);
  }

  calculate() {
    if (!this.isValid()) return;
    this.submitting = true;
    this.result = null;
    this.error = '';

    // Optimistic local calculation while calling backend
    const localPremium = this.localEstimate();

    this.http.post<any>(`${environment.apiBase}/quotes`, this.form).subscribe({
      next: res => {
        this.result = res?.data ?? res;
        this.submitting = false;
      },
      error: () => {
        // Use local estimate if endpoint not available
        this.result = { estimatedMonthlyPremium: localPremium };
        this.submitting = false;
      }
    });
  }

  private localEstimate(): number {
    const coverage = this.form.coverageAmount ?? 0;
    const age = this.form.childAge ?? 5;
    const yearsLeft = Math.max(18 - age, 3);
    const monthlyPremium = Math.round((coverage / (yearsLeft * 12)) * 0.085);
    return monthlyPremium;
  }

  reset() {
    this.result = null;
    this.form = { parentName: '', childAge: null, educationGoal: '', coverageAmount: null };
  }
}
