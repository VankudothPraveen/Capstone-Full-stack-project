import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { PolicyApplicationService } from '../../services/policy-application.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicyApplication } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-application-list',
    standalone: true,
    imports: [RouterLink, DatePipe],
    templateUrl: './application-list.component.html'
})
export class ApplicationListComponent implements OnInit {
    auth = inject(AuthService);
    private appApi = inject(PolicyApplicationService);
    private toast = inject(ToastService);
    applications = signal<PolicyApplication[]>([]);
    cancellingId = signal<number | null>(null);

    // View reason modal state
    showReasonModal = signal(false);
    viewReasonText = signal('');

    ngOnInit() {
        this.loadApplications();
    }

    private loadApplications() {
        this.appApi.getMyApplications(0, 50).subscribe({
            next: (res: any) => {
                const list = Array.isArray(res) ? res
                    : Array.isArray(res.data) ? res.data
                    : Array.isArray(res.content) ? res.content
                    : [];
                this.applications.set(list);
            },
            error: () => this.applications.set([])
        });
    }

    cancelApplication(app: PolicyApplication) {
        if (!confirm(`Cancel application for "${app.policyName}"? This cannot be undone.`)) return;
        this.cancellingId.set(app.applicationId);
        this.appApi.cancel(app.applicationId).subscribe({
            next: () => {
                this.toast.success('Application cancelled successfully');
                this.cancellingId.set(null);
                this.loadApplications();
            },
            error: err => {
                this.toast.error(err.message || 'Failed to cancel application');
                this.cancellingId.set(null);
            }
        });
    }

    getStatusCls(s: string) {
        const m: Record<string, string> = {
            ACTIVE: 'badge-success', APPROVED: 'badge-success',
            PENDING: 'badge-warning', REJECTED: 'badge-danger',
            CANCELLED: 'badge-gray'
        };
        return m[s] || 'badge-gray';
    }

    openReasonModal(reason: string) {
        this.viewReasonText.set(reason);
        this.showReasonModal.set(true);
    }

    closeReasonModal() {
        this.showReasonModal.set(false);
        this.viewReasonText.set('');
    }

    downloadCertificate(app: PolicyApplication) {
        if (!app.applicationId) return;
        
        this.appApi.downloadCertificate(app.applicationId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const aElement = document.createElement('a');
                aElement.href = url;
                aElement.download = `Policy_Certificate_APP-${app.applicationId}.pdf`;
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
