import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PolicyApplicationService } from '../../services/policy-application.service';
import { PolicyApplication } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-application-details',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './application-details.component.html'
})
export class ApplicationDetailsComponent implements OnInit {
    private appApi = inject(PolicyApplicationService);
    route = inject(ActivatedRoute);
    app = signal<PolicyApplication | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.appApi.getById(+id).subscribe({
                next: a => this.app.set(a),
                error: () => this.app.set(null)
            });
        }
    }

    details = () => {
        const a = this.app();
        if (!a) return [];
        return [
            { label: 'Child Name', value: a.childName },
            { label: 'Payment Frequency', value: a.paymentFrequency },
            { label: 'Base Premium', value: a.basePremium ? '₹' + a.basePremium.toLocaleString() : 'N/A' },
            { label: 'Final Premium (After Underwriting)', value: a.calculatedPremium ? '₹' + a.calculatedPremium.toLocaleString() : 'Pending' },
            { label: 'Application Date', value: new Date(a.applicationDate).toLocaleDateString('en-IN') },
            { label: 'Approval Date', value: a.approvalDate ? new Date(a.approvalDate).toLocaleDateString('en-IN') : 'Pending' },
            { label: 'Start Date', value: new Date(a.startDate).toLocaleDateString('en-IN') },
            { label: 'End Date', value: new Date(a.endDate).toLocaleDateString('en-IN') },
            { label: 'Total Paid', value: '₹' + a.totalPaidAmount.toLocaleString() },
        ];
    };

    statusSteps = () => {
        const a = this.app();
        if (!a) return [];
        const steps = [
            { num: '1', label: 'Application Submitted', done: true, date: a.applicationDate },
            { num: '2', label: 'Under Review', done: a.status !== 'PENDING', date: null },
            { num: '3', label: a.status === 'REJECTED' ? 'Application Rejected' : 'Application Approved', done: a.status === 'APPROVED' || a.status === 'ACTIVE' || a.status === 'REJECTED', date: a.approvalDate },
            { num: '4', label: 'Policy Activated', done: a.status === 'ACTIVE', date: a.approvalDate },
        ];
        return steps;
    };

    getStatusCls(s: string) {
        const m: Record<string, string> = { ACTIVE: 'badge-success', APPROVED: 'badge-success', PENDING: 'badge-warning', REJECTED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }

    downloadCertificate() {
        const a = this.app();
        if (!a || !a.applicationId) return;
        
        this.appApi.downloadCertificate(a.applicationId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const aElement = document.createElement('a');
                aElement.href = url;
                aElement.download = `Policy_Certificate_APP-${a.applicationId}.pdf`;
                document.body.appendChild(aElement);
                aElement.click();
                document.body.removeChild(aElement);
                window.URL.revokeObjectURL(url);
            },
            error: (err) => {
                console.error('Failed to download certificate', err);
                alert('Failed to download certificate. Please try again later.');
            }
        });
    }
}
