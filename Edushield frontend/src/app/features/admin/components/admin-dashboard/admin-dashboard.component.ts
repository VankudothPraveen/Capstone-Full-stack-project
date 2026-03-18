import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { AdminApplicationService } from '../../services/admin-application.service';
import { AdminClaimService } from '../../services/admin-claim.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicyApplication, Claim, MonthlyRevenueReport } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './admin-dashboard.component.html'
})
export class AdminDashboardComponent implements OnInit {
    private dashApi = inject(AdminDashboardService);
    private appApi = inject(AdminApplicationService);
    private claimApi = inject(AdminClaimService);
    toast = inject(ToastService);

    metricsData = signal<any>(null);
    pendingApps = signal<PolicyApplication[]>([]);
    pendingClaims = signal<Claim[]>([]);
    revenueData = signal<MonthlyRevenueReport[]>([]);

    get metrics() {
        const s = this.metricsData();
        if (!s) return [];

        // Handle both old and new backend DTO field names to prevent nulls/0s
        const totalUsers = s.totalUsers || 0;
        const totalApps = s.totalApplications || s.totalPolicies || 0;
        const activePol = s.activePolicies || s.activePoliciesCount || 0;
        const prem = s.totalPremiumPaid || s.totalPremiumCollected || 0;
        const pendingClaims = s.pendingClaims || 0;
        const approvedClaims = s.approvedClaims || 0;
        const totalClaims = s.totalClaimsCount || (pendingClaims + approvedClaims) || 0;
        const totalPol = s.totalPolicies || 0;
        const children = s.totalChildren || 0;
        const pendingApps = s.pendingApplications || 0;

        return [
            { label: 'Total Users', value: totalUsers.toString(), trend: 'Registered', badgeClass: 'badge-info' },
            { label: 'Applications', value: totalApps.toString(), trend: pendingApps + ' pending', badgeClass: 'badge-warning' },
            { label: 'Active Policies', value: activePol.toString(), trend: 'Active subs', badgeClass: 'badge-success' },
            { label: 'Total Premium', value: '₹' + (prem / 1000).toFixed(0) + 'K', trend: 'Collected', badgeClass: 'badge-success' },
            { label: 'Claims', value: totalClaims.toString(), trend: pendingClaims + ' pending', badgeClass: 'badge-warning' },
            { label: 'Policies', value: totalPol.toString(), trend: 'In catalog', badgeClass: 'badge-info' },
            { label: 'Pending Claims', value: pendingClaims.toString(), trend: 'Review', badgeClass: 'badge-danger' },
            { label: 'Total Children', value: children.toString(), trend: 'Insured', badgeClass: 'badge-gold' },
        ];
    }

    formatMonth(month: any): string {
        if (typeof month === 'string') return month;
        return month?.month || 'Month';
    }

    ngOnInit() {
        this.dashApi.getMetrics().subscribe({
            next: m => this.metricsData.set(m),
            error: () => this.metricsData.set(null)
        });
        this.dashApi.getMonthlyRevenue(new Date().getFullYear()).subscribe({
            next: data => this.revenueData.set(data),
            error: () => this.revenueData.set([])
        });
        this.loadPendingApps();
        this.loadPendingClaims();
    }

    private unwrapArray(res: any): any[] {
        if (Array.isArray(res)) return res;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (res?.content && Array.isArray(res.content)) return res.content;
        if (res?.data?.content && Array.isArray(res.data.content)) return res.data.content;
        return [];
    }

    private loadPendingApps() {
        this.appApi.getAll(0, 50).subscribe({
            next: res => {
                const data = this.unwrapArray(res);
                this.pendingApps.set(data.filter(a => a.status === 'PENDING'));
            },
            error: () => this.pendingApps.set([])
        });
    }

    private loadPendingClaims() {
        this.claimApi.getAll(0, 50).subscribe({
            next: res => {
                const data = this.unwrapArray(res);
                this.pendingClaims.set(data.filter(c => c.status === 'SUBMITTED' || c.status === 'PENDING'));
            },
            error: () => this.pendingClaims.set([])
        });
    }

    approveApp(id: number) {
        this.appApi.approve(id).subscribe({
            next: () => { this.toast.success('Application approved!'); this.loadPendingApps(); },
            error: err => this.toast.error(err.message || 'Failed to approve')
        });
    }

    rejectApp(id: number) {
        const reason = prompt('Enter rejection reason:');
        if (reason === null) return;
        this.appApi.reject(id, reason).subscribe({
            next: () => { this.toast.warning('Application rejected'); this.loadPendingApps(); },
            error: err => this.toast.error(err.message || 'Failed to reject')
        });
    }

    approveClaim(id: number) {
        this.claimApi.approve(id).subscribe({
            next: () => { this.toast.success('Claim approved!'); this.loadPendingClaims(); },
            error: err => this.toast.error(err.message || 'Failed to approve')
        });
    }

    rejectClaim(id: number) {
        const reason = prompt('Enter rejection reason:');
        if (reason === null || reason.trim() === '') return;
        this.claimApi.reject(id, reason.trim()).subscribe({
            next: () => { this.toast.warning('Claim rejected'); this.loadPendingClaims(); },
            error: err => this.toast.error(err.message || 'Failed to reject')
        });
    }
}
