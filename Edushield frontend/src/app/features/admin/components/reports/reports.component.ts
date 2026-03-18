import { Component, inject, signal, OnInit } from '@angular/core';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { MonthlyRevenueReport } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-reports', standalone: true,
    templateUrl: './reports.component.html' })
export class ReportsComponent implements OnInit {
    private dashApi = inject(AdminDashboardService);

    revenueData = signal<MonthlyRevenueReport[]>([]);

    summaryMetrics = signal([
        { label: 'Total Revenue', value: '...' },
        { label: 'Total Payments', value: '...' },
        { label: 'Total Claims', value: '...' },
        { label: 'Avg Margin', value: '...' },
    ]);

    ngOnInit() {
        this.dashApi.getMonthlyRevenue(new Date().getFullYear()).subscribe({
            next: data => {
                this.revenueData.set(data);
                const totalRev = data.reduce((s, r) => s + r.totalRevenue, 0);
                const totalPay = data.reduce((s, r) => s + r.totalPayments, 0);
                const totalCl = data.reduce((s, r) => s + r.totalClaims, 0);
                const netRev = data.reduce((s, r) => s + r.netRevenue, 0);
                this.summaryMetrics.set([
                    { label: 'Total Revenue', value: '₹' + (totalRev / 100000).toFixed(1) + 'L' },
                    { label: 'Total Payments', value: totalPay.toLocaleString() },
                    { label: 'Total Claims', value: totalCl.toLocaleString() },
                    { label: 'Avg Margin', value: totalRev > 0 ? ((netRev / totalRev) * 100).toFixed(1) + '%' : 'N/A' },
                ]);
            },
            error: () => this.revenueData.set([])
        });
    }
}
