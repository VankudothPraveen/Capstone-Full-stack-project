import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';

interface PolicyCard {
  policyId: number;
  policyName: string;
  basePremium: number;
  durationYears: number;
  bonusPercentage: number;
  riskCoverageAmount: number;
  maturityBenefitAmount: number;
  minChildAge: number;
  maxChildAge: number;
  waiverOfPremium: boolean;
  isActive: boolean;
  description: string;
}

@Component({
  selector: 'app-coverage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coverage.component.html',
})
export class CoverageComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  policies: PolicyCard[] = [];
  loading = true;
  error = '';

  // Mark second plan as recommended
  recommendedIndex = 1;

  ngOnInit() {
    this.http.get<any>(`${environment.apiBase}/policies?page=0&size=6`).subscribe({
      next: res => {
        const data = res?.data ?? res;
        this.policies = Array.isArray(data) ? data : (data?.content ?? []);
        this.loading = false;
      },
      error: () => {
        // Fallback static plans if backend unavailable
        this.policies = [
          { policyId: 1, policyName: 'Basic Education Plan', basePremium: 3000, durationYears: 8, bonusPercentage: 10, riskCoverageAmount: 500000, maturityBenefitAmount: 250000, minChildAge: 0, maxChildAge: 8, waiverOfPremium: true, isActive: true, description: 'Affordable basic education insurance for young families.' },
          { policyId: 2, policyName: 'BrightFuture Plan', basePremium: 5000, durationYears: 10, bonusPercentage: 15.5, riskCoverageAmount: 1000000, maturityBenefitAmount: 500000, minChildAge: 0, maxChildAge: 10, waiverOfPremium: true, isActive: true, description: 'Comprehensive education plan for school-going children.' },
          { policyId: 3, policyName: 'DreamAchiever Plan', basePremium: 12000, durationYears: 18, bonusPercentage: 25, riskCoverageAmount: 3000000, maturityBenefitAmount: 1500000, minChildAge: 0, maxChildAge: 12, waiverOfPremium: true, isActive: true, description: 'Premium plan for complete education coverage.' },
        ];
        this.loading = false;
      }
    });
  }

  formatAmount(amount: number): string {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }

  viewDetails(id: number) {
    this.router.navigate(['/auth/login']);
  }
}
