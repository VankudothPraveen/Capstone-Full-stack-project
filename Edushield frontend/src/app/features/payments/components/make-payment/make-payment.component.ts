import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { PremiumPaymentService } from '../../services/premium-payment.service';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicySubscription } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-make-payment',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './make-payment.component.html'
})
export class MakePaymentComponent implements OnInit {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    private paymentApi = inject(PremiumPaymentService);
    private subApi = inject(SubscriptionService);
    toast = inject(ToastService);
    loading = signal(false);
    paid = signal(false);
    selectedMethod = signal<string>('');
    paidAmount = signal(0);
    txnId = Math.floor(Math.random() * 90000000) + 10000000;

    paymentMethods = [
        { id: 'upi', icon: null, label: 'UPI' },
        { id: 'card', icon: null, label: 'Card' },
        { id: 'netbanking', icon: null, label: 'Net Banking' },
    ];

    form = this.fb.group({
        subscriptionId: ['', Validators.required],
        amount: [null, [Validators.required, Validators.min(1)]],
    });

    subscriptions = signal<PolicySubscription[]>([]);
    selectedSubscription = signal<PolicySubscription | null>(null);

    ngOnInit() {
        this.subApi.getMySubscriptions(0, 50).subscribe({
            next: (res: any) => {
                // Handle multiple response structures
                let subs: PolicySubscription[] = [];
                if (Array.isArray(res)) {
                    subs = res;
                } else if (res && Array.isArray(res.data)) {
                    subs = res.data;
                } else if (res && Array.isArray(res.content)) {
                    subs = res.content;
                }
                // Show all subscriptions (ACTIVE shown first but all visible)
                this.subscriptions.set(subs);
            },
            error: () => this.subscriptions.set([])
        });
    }

    onSubscriptionChange(event: Event) {
        const id = +(event.target as HTMLSelectElement).value;
        const sub = this.subscriptions().find(s => s.subscriptionId === id) || null;
        this.selectedSubscription.set(sub);
        if (sub) {
            // Auto-fill the premium amount
            this.form.patchValue({ amount: sub.premiumAmount as any });
        } else {
            this.form.patchValue({ amount: null });
        }
    }

    onSubmit() {
        if (this.form.invalid || !this.selectedMethod()) return;
        this.loading.set(true);

        // Backend requires paymentDate as LocalDate (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        this.paymentApi.makePayment({
            subscriptionId: +this.form.value.subscriptionId!,
            amount: Number(this.form.value.amount) as any,
            paymentDate: today as any,
        }).subscribe({
            next: () => {
                this.paidAmount.set(this.form.value.amount || 0);
                this.paid.set(true);
                this.loading.set(false);
                this.toast.success('Payment of ₹' + this.form.value.amount + ' processed successfully!');
            },
            error: err => {
                this.loading.set(false);
                this.toast.error(err.message || 'Payment failed');
            }
        });
    }
}
