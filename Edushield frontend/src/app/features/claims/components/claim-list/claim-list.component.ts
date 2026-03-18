import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ClaimService } from '../../services/claim.service';
import { Claim } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-claim-list',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './claim-list.component.html'
})
export class ClaimListComponent implements OnInit {
    auth = inject(AuthService);
    private claimApi = inject(ClaimService);
    activeFilter = signal('All');
    filters = ['All', 'PENDING', 'APPROVED', 'PAID', 'REJECTED'];
    myClaims = signal<Claim[]>([]);

    ngOnInit() {
        this.claimApi.getMyClaims(0, 100).subscribe({
            next: res => this.myClaims.set(res.data),
            error: () => this.myClaims.set([])
        });
    }

    filteredClaims = computed(() => {
        const c = this.myClaims();
        return this.activeFilter() === 'All' ? c : c.filter(x => x.status === this.activeFilter());
    });

    getStatusCls(s: string) {
        const m: Record<string, string> = { APPROVED: 'badge-success', PAID: 'badge-gold', PENDING: 'badge-warning', REJECTED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }
    getClaimIcon(t: string) {
        const m: Record<string, string> = { MATURITY: '🎓', DEATH: '💔', PARTIAL_WITHDRAWAL: '💰' };
        return m[t] || '🛡️';
    }
    getClaimBg(t: string) {
        const m: Record<string, string> = { MATURITY: 'bg-emerald-100', DEATH: 'bg-red-100', PARTIAL_WITHDRAWAL: 'bg-blue-100' };
        return m[t] || 'bg-gray-100';
    }
}
