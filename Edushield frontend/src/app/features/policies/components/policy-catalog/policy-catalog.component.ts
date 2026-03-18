import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../../../core/models/interfaces';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-policy-catalog',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './policy-catalog.component.html'
})
export class PolicyCatalogComponent implements OnInit {
  private policyApi = inject(PolicyService);
  activeFilter = signal('All');
  filters = ['All', 'Short Term (< 12yr)', 'Long Term (≥ 12yr)', 'With Waiver', 'Budget'];
  allPolicies = signal<Policy[]>([]);

  ngOnInit() {
    this.policyApi.getAll(0, 100).subscribe({
      next: res => this.allPolicies.set(res.data),
      error: () => this.allPolicies.set([])
    });
  }

  filteredPolicies = computed(() => {
    return this.allPolicies().filter(p => {
      if (this.activeFilter() === 'All') return true;
      if (this.activeFilter() === 'With Waiver') return p.waiverOfPremium;
      if (this.activeFilter() === 'Budget') return p.basePremium <= 2500;
      if (this.activeFilter() === 'Short Term (< 12yr)') return p.durationYears < 12;
      if (this.activeFilter() === 'Long Term (≥ 12yr)') return p.durationYears >= 12;
      return true;
    });
  });
}
