import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { PolicySubscription } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-subscription-details',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './subscription-details.component.html'
})
export class SubscriptionDetailsComponent implements OnInit {
    private subApi = inject(SubscriptionService);
    route = inject(ActivatedRoute);
    sub = signal<PolicySubscription | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.subApi.getById(+id).subscribe({
                next: s => this.sub.set(s),
                error: () => this.sub.set(null)
            });
        }
    }

    timeline = () => {
        const s = this.sub();
        if (!s) return [];
        const now = new Date();
        return [
            { icon: '🎯', label: 'Subscription Started', date: s.startDate, passed: new Date(s.startDate) <= now },
            { icon: '📅', label: 'Maturity Date', date: s.maturityDate, passed: new Date(s.maturityDate) <= now },
            { icon: '🏁', label: 'Policy End Date', date: s.endDate, passed: new Date(s.endDate) <= now },
        ];
    };

    detailItems = () => {
        const s = this.sub();
        if (!s) return [];
        return [
            { label: 'Status', value: s.status },
            { label: 'Coverage Amount', value: '₹' + (s.coverageAmount / 100000).toFixed(1) + 'L' },
            { label: 'Premium/month', value: '₹' + s.premiumAmount.toLocaleString() },
            { label: 'Start Date', value: new Date(s.startDate).toLocaleDateString('en-IN') },
            { label: 'Maturity Date', value: new Date(s.maturityDate).toLocaleDateString('en-IN') },
            { label: 'Total Paid', value: '₹' + s.totalPaidAmount.toLocaleString() },
        ];
    };
}
