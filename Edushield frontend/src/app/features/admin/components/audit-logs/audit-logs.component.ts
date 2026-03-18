import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminAuditService } from '../../services/admin-audit.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  private auditService = inject(AdminAuditService);

  logs = signal<any[]>([]);
  actions = signal<string[]>([]);
  totalElements = signal(0);
  totalPages = signal(0);
  currentPage = signal(0);
  pageSize = 15;
  loading = signal(false);

  // Filters
  filterAction = '';
  filterEmail = '';
  filterStartDate = '';
  filterEndDate = '';

  // Export
  exporting = signal<string | null>(null);

  ngOnInit() {
    this.loadActions();
    this.loadLogs();
  }

  loadActions() {
    this.auditService.getDistinctActions().subscribe({
      next: (data) => this.actions.set(data || []),
      error: (err) => console.error('Failed to load actions', err)
    });
  }

  loadLogs() {
    this.loading.set(true);
    const filters: any = {};
    if (this.filterAction) filters.action = this.filterAction;
    if (this.filterEmail) filters.email = this.filterEmail;
    if (this.filterStartDate) filters.startDate = this.filterStartDate + 'T00:00:00';
    if (this.filterEndDate) filters.endDate = this.filterEndDate + 'T23:59:59';

    this.auditService.getAuditLogs(this.currentPage(), this.pageSize, filters).subscribe({
      next: (data) => {
        this.logs.set(data?.content || []);
        this.totalElements.set(data?.totalElements || 0);
        this.totalPages.set(data?.totalPages || 0);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load audit logs', err);
        this.loading.set(false);
      }
    });
  }

  applyFilters() {
    this.currentPage.set(0);
    this.loadLogs();
  }

  clearFilters() {
    this.filterAction = '';
    this.filterEmail = '';
    this.filterStartDate = '';
    this.filterEndDate = '';
    this.currentPage.set(0);
    this.loadLogs();
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadLogs();
    }
  }

  // ─── Export ───────────────────────────────────────────────────────

  exportData(type: string) {
    this.exporting.set(type);
    let obs;
    let filename: string;

    switch (type) {
      case 'users':
        obs = this.auditService.exportUsers();
        filename = 'users_export.xlsx';
        break;
      case 'policies':
        obs = this.auditService.exportPolicies();
        filename = 'policies_export.xlsx';
        break;
      case 'applications':
        obs = this.auditService.exportApplications();
        filename = 'applications_export.xlsx';
        break;
      case 'claims':
        obs = this.auditService.exportClaims();
        filename = 'claims_export.xlsx';
        break;
      case 'audit-logs':
        obs = this.auditService.exportAuditLogs();
        filename = 'audit_logs_export.xlsx';
        break;
      default:
        return;
    }

    obs.subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename!;
        a.click();
        window.URL.revokeObjectURL(url);
        this.exporting.set(null);
      },
      error: (err: any) => {
        console.error('Export failed', err);
        this.exporting.set(null);
      }
    });
  }

  getActionBadgeColor(action: string): string {
    const colors: Record<string, string> = {
      'USER_REGISTRATION': 'bg-blue-100 text-blue-700',
      'USER_LOGIN': 'bg-indigo-100 text-indigo-700',
      'POLICY_CREATED': 'bg-emerald-100 text-emerald-700',
      'POLICY_UPDATED': 'bg-teal-100 text-teal-700',
      'APPLICATION_SUBMITTED': 'bg-amber-100 text-amber-700',
      'APPROVED_APPLICATION': 'bg-green-100 text-green-700',
      'REJECTED_APPLICATION': 'bg-red-100 text-red-700',
      'CLAIM_SUBMITTED': 'bg-orange-100 text-orange-700',
      'CLAIM_APPROVED': 'bg-emerald-100 text-emerald-700',
      'CLAIM_REJECTED': 'bg-rose-100 text-rose-700',
      'PREMIUM_PAYMENT': 'bg-purple-100 text-purple-700'
    };
    return colors[action] || 'bg-gray-100 text-gray-700';
  }
}
