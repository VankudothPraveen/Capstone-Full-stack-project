import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { PremiumPaymentService } from '../../services/premium-payment.service';
import { PolicySubscription } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-upcoming-payments',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './upcoming-payments.component.html'
})
export class UpcomingPaymentsComponent implements OnInit {
    auth = inject(AuthService);
    private subApi = inject(SubscriptionService);
    private paymentApi = inject(PremiumPaymentService);

    subscriptions = signal<PolicySubscription[]>([]);
    paidCountMap = signal<Record<number, number>>({});

    // Compute upcoming payment info per active subscription
    upcomingPayments = computed(() => {
        const today = new Date();
        return this.subscriptions()
            .filter(s => s.status === 'ACTIVE')
            .map(s => {
                const start = new Date(s.startDate);
                const paidMonths = this.paidCountMap()[s.subscriptionId] || 0;
                // Next due = start date + paidMonths months
                const nextDue = new Date(start);
                nextDue.setMonth(nextDue.getMonth() + paidMonths);
                const isOverdue = nextDue < today;
                return {
                    subscriptionId: s.subscriptionId,
                    subscriptionNumber: s.subscriptionNumber,
                    policyName: s.policyName,
                    childName: s.childName,
                    premiumAmount: s.premiumAmount,
                    nextDueDate: nextDue,
                    isOverdue,
                    status: isOverdue ? 'OVERDUE' : 'PENDING',
                    maturityDate: s.maturityDate,
                    totalPaidAmount: s.totalPaidAmount,
                };
            });
    });

    ngOnInit() {
        // Load active subscriptions
        this.subApi.getMySubscriptions(0, 50).subscribe({
            next: (res: any) => {
                let subs: PolicySubscription[] = [];
                if (Array.isArray(res)) subs = res;
                else if (res?.data && Array.isArray(res.data)) subs = res.data;
                else if (res?.content && Array.isArray(res.content)) subs = res.content;
                this.subscriptions.set(subs.filter((s: PolicySubscription) => s.status === 'ACTIVE'));
            },
            error: () => this.subscriptions.set([])
        });

        // Load payment history to count how many months have been paid
        this.paymentApi.getMyPayments(0, 200).subscribe({
            next: (res: any) => {
                let payments: any[] = [];
                if (Array.isArray(res)) payments = res;
                else if (res?.data && Array.isArray(res.data)) payments = res.data;
                else if (res?.content && Array.isArray(res.content)) payments = res.content;

                // Count paid payments per subscription
                const countMap: Record<number, number> = {};
                for (const p of payments) {
                    if (p.status === 'PAID' && p.subscriptionId) {
                        countMap[p.subscriptionId] = (countMap[p.subscriptionId] || 0) + 1;
                    }
                }
                this.paidCountMap.set(countMap);
            },
            error: () => this.paidCountMap.set({})
        });
    }
}
