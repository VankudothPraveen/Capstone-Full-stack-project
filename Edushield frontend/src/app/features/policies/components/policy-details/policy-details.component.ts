import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../../../core/models/interfaces';

@Component({
  selector: 'app-policy-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './policy-details.component.html'
})
export class PolicyDetailsComponent implements OnInit {
  private policyApi = inject(PolicyService);
  route = inject(ActivatedRoute);
  policy = signal<Policy | null>(null);

  keyMetrics = computed(() => {
    const p = this.policy();
    if (!p) return [];
    return [
      { label: 'Base Premium/mo', value: '₹' + (p.basePremium?.toLocaleString() || '0') },
      { label: 'Maturity Benefit', value: '₹' + ((p.maturityBenefitAmount || 0) / 100000).toFixed(1) + 'L' },
      { label: 'Risk Coverage', value: '₹' + ((p.riskCoverageAmount || 0) / 100000).toFixed(0) + 'L' },
      { label: 'Bonus Rate', value: (p.bonusPercentage || 0) + '%' },
    ];
  });

  financialItems = computed(() => {
    const p = this.policy();
    if (!p) return [];
    return [
      { label: 'Base Premium', value: '₹' + (p.basePremium?.toLocaleString() || '0') + '/month' },
      { label: 'Duration', value: (p.durationYears || 0) + ' years' },
      { label: 'Maturity Benefit', value: '₹' + (p.maturityBenefitAmount?.toLocaleString() || '0') },
      { label: 'Death Benefit', value: (p.deathBenefitMultiplier || 0) + 'x premium paid' },
      { label: 'Risk Coverage', value: '₹' + (p.riskCoverageAmount?.toLocaleString() || '0') },
      { label: 'Guaranteed Bonus', value: (p.bonusPercentage || 0) + '% per annum' },
    ];
  });

  features = computed(() => {
    const p = this.policy();
    if (!p) return [];
    return [
      { icon: '👶', label: 'Child Age Eligibility', value: (p.minChildAge || 0) + ' to ' + (p.maxChildAge || 0) + ' years' },
      { icon: p.waiverOfPremium ? '✅' : '❌', label: 'Premium Waiver', value: p.waiverOfPremium ? 'Yes — on parent death/disability' : 'Not included' },
      { icon: '⏱️', label: 'Policy Duration', value: (p.durationYears || 0) + ' years' },
      { icon: '🏥', label: 'Death Benefit Multiplier', value: (p.deathBenefitMultiplier || 0) + 'x of sum assured' },
      { icon: '📊', label: 'Policy Status', value: p.isActive ? 'Currently Available' : 'Discontinued' },
    ];
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.policyApi.getById(+id).subscribe({
        next: p => this.policy.set(p),
        error: () => this.policy.set(null)
      });
    }
  }
}
