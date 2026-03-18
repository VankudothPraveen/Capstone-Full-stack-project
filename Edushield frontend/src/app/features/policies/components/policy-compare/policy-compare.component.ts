import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PolicyService } from '../../services/policy.service';
import { Policy } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-policy-compare',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './policy-compare.component.html'
})
export class PolicyCompareComponent implements OnInit {
    private policyApi = inject(PolicyService);
    allPolicies = signal<Policy[]>([]);
    selected = signal<Policy[]>([]);

    ngOnInit() {
        this.policyApi.getAll(0, 100).subscribe({
            next: res => this.allPolicies.set(res.data),
            error: () => this.allPolicies.set([])
        });
    }

    isSelected(p: Policy) { return this.selected().some(s => s.policyId === p.policyId); }

    togglePolicy(p: Policy) {
        if (this.isSelected(p)) this.selected.update(s => s.filter(x => x.policyId !== p.policyId));
        else if (this.selected().length < 3) this.selected.update(s => [...s, p]);
    }

    compareRows = [
        { label: 'Base Premium/month', getValue: (p: Policy) => `<strong>₹${(p.basePremium || 0).toLocaleString()}</strong>` },
        { label: 'Duration', getValue: (p: Policy) => `${p.durationYears || 'N/A'} years` },
        { label: 'Maturity Benefit', getValue: (p: Policy) => p.maturityBenefitAmount ? `<strong class="text-emerald-600">₹${(p.maturityBenefitAmount / 100000).toFixed(1)}L</strong>` : `<span class="text-medium-gray text-xs">Not specified</span>` },
        { label: 'Risk Coverage', getValue: (p: Policy) => p.riskCoverageAmount ? `₹${(p.riskCoverageAmount / 100000).toFixed(0)}L` : `<span class="text-medium-gray text-xs">N/A</span>` },
        { label: 'Bonus Rate', getValue: (p: Policy) => `<span class="badge badge-success">${p.bonusPercentage || 0}%</span>` },
        { label: 'Death Benefit', getValue: (p: Policy) => p.deathBenefitMultiplier != null ? `${p.deathBenefitMultiplier}x Sum Assured` : `<span class="text-medium-gray text-xs">N/A</span>` },
        { label: 'Child Age Eligibility', getValue: (p: Policy) => (p.minChildAge != null && p.maxChildAge != null) ? `${p.minChildAge}–${p.maxChildAge} yrs` : `<span class="text-medium-gray text-xs">0–18 yrs</span>` },
        { label: 'Premium Waiver', getValue: (p: Policy) => p.waiverOfPremium ? '✅ Yes' : '❌ No' },
        { label: 'Status', getValue: (p: Policy) => p.isActive ? '<span class="badge badge-success">Active</span>' : '<span class="badge badge-gray">Discontinued</span>' },
    ];
}
