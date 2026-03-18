import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { PremiumPaymentService } from '../../services/premium-payment.service';
import { PremiumPayment } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-payment-history',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './payment-history.component.html'
})
export class PaymentHistoryComponent implements OnInit {
    auth = inject(AuthService);
    private paymentApi = inject(PremiumPaymentService);
    activeFilter = signal('All');
    filters = ['All', 'PAID', 'PENDING', 'OVERDUE'];
    myPayments = signal<PremiumPayment[]>([]);

    ngOnInit() {
        this.paymentApi.getMyPayments(0, 100).subscribe({
            next: res => this.myPayments.set(res.data),
            error: () => this.myPayments.set([])
        });
    }

    filteredPayments = computed(() => {
        const p = this.myPayments();
        if (this.activeFilter() === 'All') return p;
        return p.filter(x => x.status === this.activeFilter());
    });

    summary = computed(() => {
        const p = this.myPayments();
        return [
            { label: 'Total Transactions', value: p.length.toString() },
            { label: 'Paid', value: p.filter(x => x.status === 'PAID').length.toString() },
            { label: 'Total Paid (₹)', value: '₹' + (p.filter(x => x.status === 'PAID').reduce((s, x) => s + x.amount, 0) / 1000).toFixed(0) + 'K' },
            { label: 'Overdue', value: p.filter(x => x.status === 'OVERDUE').length.toString() },
        ];
    });

    getStatusCls(s: string) {
        const m: Record<string, string> = { PAID: 'badge-success', PENDING: 'badge-warning', OVERDUE: 'badge-danger', FAILED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }
}
