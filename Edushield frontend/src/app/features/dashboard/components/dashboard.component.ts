import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';
import { AdminDashboardService } from '../../admin/services/admin-dashboard.service';
import { PolicyApplicationService } from '../../applications/services/policy-application.service';
import { SubscriptionService } from '../../subscriptions/services/subscription.service';
import { PremiumPaymentService } from '../../payments/services/premium-payment.service';
import { ClaimService } from '../../claims/services/claim.service';
import { ChildService } from '../../children/services/child.service';
import { PolicyService } from '../../policies/services/policy.service';
import { DashboardMetrics, PolicyApplication } from '../../../core/models/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  private dashboardApi = inject(AdminDashboardService);
  private appApi = inject(PolicyApplicationService);
  private subApi = inject(SubscriptionService);
  private payApi = inject(PremiumPaymentService);
  private claimApi = inject(ClaimService);
  private childApi = inject(ChildService);
  private policyApi = inject(PolicyService);
  today = new Date();

  metricsSignal = signal<DashboardMetrics | null>(null);
  recentApplications = signal<PolicyApplication[]>([]);

  quickActions = [
    { label: 'Add Child', desc: 'Register a new child', route: '/children/add' },
    { label: 'Browse Policies', desc: 'View available plans', route: '/policies/catalog' },
    { label: 'Make Payment', desc: 'Pay your premium', route: '/payments/make-payment' },
    { label: 'File a Claim', desc: 'Submit new claim', route: '/claims/file-claim' },
    { label: 'Benefit Calculator', desc: 'Calculate maturity', route: '/benefits/calculator' },
  ];

  metricCards = computed(() => {
    const m = this.metricsSignal();
    if (!m) return [];
    return [
      { label: 'Active Policies', value: m.activePolicies.toString(), trend: 'Active', badgeClass: 'badge-success' },
      { label: 'Premium Paid', value: '₹' + (m.totalPremiumPaid / 1000).toFixed(0) + 'K', trend: 'All time', badgeClass: 'badge-gold' },
      { label: 'Children Insured', value: m.totalChildren.toString(), trend: 'Insured', badgeClass: 'badge-info' },
      { label: 'Due Payments', value: m.upcomingPayments.toString(), trend: 'Due soon', badgeClass: 'badge-warning' },
      { label: 'Pending Claims', value: m.pendingClaims.toString(), trend: 'Review', badgeClass: 'badge-warning' },
      { label: 'Approved Claims', value: m.approvedClaims.toString(), trend: 'Settled', badgeClass: 'badge-success' },
      { label: 'Claim Amount', value: '₹' + (m.totalClaimAmount / 1000).toFixed(0) + 'K', trend: 'Paid', badgeClass: 'badge-info' },
      { label: 'Available Policies', value: m.totalPolicies.toString(), trend: 'Catalog', badgeClass: 'badge-maroon' },
    ];
  });

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      'ACTIVE': 'badge-success', 'APPROVED': 'badge-success',
      'PENDING': 'badge-warning', 'REJECTED': 'badge-danger',
    };
    return map[status] || 'badge-gray';
  }

  ngOnInit() {
    this.appApi.getMyApplications(0, 4).subscribe({
      next: res => {
        const data = res?.data || (Array.isArray(res) ? res : []);
        this.recentApplications.set(Array.isArray(data) ? data : []);
      },
      error: () => this.recentApplications.set([])
    });

    if (this.auth.isAdmin()) {
      this.dashboardApi.getMetrics().subscribe({
        next: m => this.metricsSignal.set(m),
        error: () => this.metricsSignal.set(null)
      });
    } else {
      this.buildUserMetrics();
    }
  }

  private buildUserMetrics() {
    const metrics: DashboardMetrics = {
      totalPolicies: 0, activePolicies: 0, totalPremiumPaid: 0,
      upcomingPayments: 0, totalChildren: 0, pendingClaims: 0,
      approvedClaims: 0, totalClaimAmount: 0
    };

    const unwrap = (res: any): any[] => {
      if (Array.isArray(res)) return res;
      if (res?.data && Array.isArray(res.data)) return res.data;
      if (res?.content && Array.isArray(res.content)) return res.content;
      return [];
    };

    this.childApi.getMyChildren(0, 100).subscribe({
      next: res => { metrics.totalChildren = unwrap(res).length; this.metricsSignal.set({ ...metrics }); },
      error: () => { }
    });

    this.subApi.getMySubscriptions(0, 100).subscribe({
      next: (res: any) => {
        const activeSubs = unwrap(res).filter((s: any) => s?.status === 'ACTIVE');
        metrics.activePolicies = activeSubs.length;
        metrics.upcomingPayments = activeSubs.length;
        this.metricsSignal.set({ ...metrics });
      },
      error: () => { }
    });

    this.payApi.getMyPayments(0, 200).subscribe({
      next: (res: any) => {
        const list = unwrap(res);
        metrics.totalPremiumPaid = list
          .filter((p: any) => p?.status === 'PAID')
          .reduce((s: number, p: any) => s + (p?.amount || 0), 0);
        this.metricsSignal.set({ ...metrics });
      },
      error: () => { }
    });

    this.claimApi.getMyClaims(0, 100).subscribe({
      next: (res: any) => {
        const list = unwrap(res);
        metrics.pendingClaims = list.filter((c: any) => c?.status === 'SUBMITTED' || c?.status === 'PENDING').length;
        metrics.approvedClaims = list.filter((c: any) => c?.status === 'APPROVED' || c?.status === 'PAID').length;
        metrics.totalClaimAmount = list
          .filter((c: any) => c?.status === 'APPROVED' || c?.status === 'PAID')
          .reduce((s: number, c: any) => s + (c?.claimAmount || 0), 0);
        this.metricsSignal.set({ ...metrics });
      },
      error: () => { }
    });

    this.policyApi.getAll(0, 100).subscribe({
      next: (res: any) => { metrics.totalPolicies = unwrap(res).length; this.metricsSignal.set({ ...metrics }); },
      error: () => { }
    });

    this.appApi.getMyApplications(0, 50).subscribe({
      next: (res: any) => { this.recentApplications.set(unwrap(res).slice(0, 4)); },
      error: () => this.recentApplications.set([])
    });
  }
}
