import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PolicySubscription } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-subscription-list',
    standalone: true,
    imports: [RouterLink, DatePipe, FormsModule],
    templateUrl: './subscription-list.component.html'
})
export class SubscriptionListComponent implements OnInit {
    auth = inject(AuthService);
    private subApi = inject(SubscriptionService);
    subscriptions = signal<PolicySubscription[]>([]);
    searchQuery = signal('');
    loading = signal(true);
    error = signal<string | null>(null);

    filteredSubscriptions = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        return this.subscriptions().filter(s => 
            !query || 
            s.policyName?.toLowerCase().includes(query) || 
            s.childName?.toLowerCase().includes(query) ||
            s.subscriptionNumber?.toLowerCase().includes(query)
        );
    });

    ngOnInit() {
        this.subApi.getMySubscriptions(0, 50).subscribe({
            next: res => {
                // Handle both PaginatedResponse and direct array
                let subs: PolicySubscription[] = [];
                if (Array.isArray(res)) {
                    subs = res;
                } else if (res && Array.isArray((res as any).data)) {
                    subs = (res as any).data;
                } else if (res && Array.isArray((res as any).content)) {
                    subs = (res as any).content;
                }
                this.subscriptions.set(subs);
                this.loading.set(false);
            },
            error: (err) => {
                this.error.set(err?.message || 'Failed to load subscriptions');
                this.subscriptions.set([]);
                this.loading.set(false);
            }
        });
    }

    getStatusCls(s: string) {
        const m: Record<string, string> = { ACTIVE: 'badge-success', MATURED: 'badge-gold', LAPSED: 'badge-warning', CANCELLED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }
}
