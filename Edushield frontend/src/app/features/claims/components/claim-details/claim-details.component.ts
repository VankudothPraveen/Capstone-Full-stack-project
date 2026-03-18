import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClaimService } from '../../services/claim.service';
import { Claim } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-claim-details',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './claim-details.component.html'
})
export class ClaimDetailsComponent implements OnInit {
    private claimApi = inject(ClaimService);
    route = inject(ActivatedRoute);
    claim = signal<Claim | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.claimApi.getById(+id).subscribe({
                next: c => this.claim.set(c),
                error: () => this.claim.set(null)
            });
        }
    }

    statusSteps = () => {
        const c = this.claim();
        if (!c) return [];
        return [
            { num: '1', label: 'Claim Filed', done: true, date: c.claimDate },
            { num: '2', label: 'Under Review', done: c.status !== 'PENDING', date: null },
            { num: '3', label: c.status === 'REJECTED' ? 'Claim Rejected' : 'Claim Approved', done: c.status === 'APPROVED' || c.status === 'PAID' || c.status === 'REJECTED', date: c.approvalDate },
            { num: '4', label: 'Amount Paid Out', done: c.status === 'PAID', date: c.payoutDate },
        ];
    };

    detailItems = () => {
        const c = this.claim();
        if (!c) return [];
        return [
            { label: 'Claim Type', value: c.claimType.replace('_', ' ') },
            { label: 'Claim Amount', value: '₹' + c.claimAmount.toLocaleString() },
            { label: 'Filed On', value: new Date(c.claimDate).toLocaleDateString('en-IN') },
            { label: 'Status', value: c.status },
            { label: 'Payout Date', value: c.payoutDate ? new Date(c.payoutDate).toLocaleDateString('en-IN') : 'N/A' },
        ];
    };
}
