import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { AdminApplicationService } from '../../services/admin-application.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicyApplication } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';
import { DocumentService } from '../../../document/services/document.service';
import { environment } from '../../../../../environments/environment';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-application-management', 
    standalone: true, 
    imports: [DatePipe, FormsModule],
    providers: [DatePipe],
    templateUrl: './application-management.component.html'
})
export class ApplicationManagementComponent implements OnInit {
    private appApi = inject(AdminApplicationService);
    private documentApi = inject(DocumentService);
    auth = inject(AuthService);
    toast = inject(ToastService);
    private datePipe = inject(DatePipe);
    private route = inject(ActivatedRoute);

    activeFilter = signal('All');
    filters = ['All', 'PENDING', 'APPROVED', 'ACTIVE', 'REJECTED'];
    searchQuery = signal('');
    allApps = signal<PolicyApplication[]>([]);

    // Reject Modal
    showRejectModal = signal(false);
    rejectingAppId = signal<number | null>(null);
    rejectionReason = signal('');

    // Approve Modal
    showApproveModal = signal(false);
    approvingAppId = signal<number | null>(null);
    approvingAppPremium = signal<number | null>(null);
    approvingRiskScore = signal<number | string>('N/A');
    approvingRiskCategory = signal<string>('N/A');
    revisedPremium = signal<number | null>(null);

    // View reason modal state
    showReasonModal = signal(false);
    viewReasonText = signal('');

    // Docs Modal
    showDocsModal = signal(false);
    selectedAppId = signal<number | null>(null);
    appDocs = signal<any[]>([]);

    ngOnInit() { 
        this.route.queryParams.subscribe((params: any) => {
            if (params['appId']) {
                this.searchQuery.set(params['appId']);
            } else {
                this.searchQuery.set('');
            }
            if (params['status']) {
                this.activeFilter.set(params['status']);
            } else if (!params['appId']) {
                this.activeFilter.set('All');
            }
        });
        this.loadApps(); 
    }

    private loadApps() {
        this.appApi.getAll(0, 500).subscribe({
            next: (res: any) => {
                let apps = [];
                if (Array.isArray(res)) apps = res;
                else if (res?.data && Array.isArray(res.data)) apps = res.data;
                else if (res?.content && Array.isArray(res.content)) apps = res.content;
                this.allApps.set(apps);
            },
            error: () => this.allApps.set([])
        });
    }

    getUserName(app: any) {
        if (app.userName) return app.userName;
        return app.userId ? `User #${app.userId}` : 'Anonymous';
    }

    getStatusCls(s: string) {
        const m: Record<string, string> = { ACTIVE: 'badge-success', APPROVED: 'badge-success', PENDING: 'badge-warning', REJECTED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }

    filteredApps = computed(() => {
        const apps = this.allApps();
        const query = this.searchQuery().toLowerCase().trim();
        const filter = this.activeFilter();

        return apps.filter(a => {
            const matchesFilter = filter === 'All' || a.status === filter;
            const matchesSearch = !query || 
                a.childName?.toLowerCase().includes(query) || 
                a.policyName?.toLowerCase().includes(query) ||
                a.applicationId.toString().includes(query) ||
                this.getUserName(a).toLowerCase().includes(query);
            
            return matchesFilter && matchesSearch;
        });
    });

    openApproveModal(app: PolicyApplication) {
        this.approvingAppId.set(app.applicationId);
        this.approvingAppPremium.set(app.calculatedPremium ?? app.basePremium ?? null);
        this.approvingRiskScore.set(app.riskScore ?? 'N/A');
        this.approvingRiskCategory.set(app.riskCategory ?? 'N/A');
        this.revisedPremium.set(app.calculatedPremium ?? app.basePremium ?? null);
        this.showApproveModal.set(true);
    }

    confirmApprove() {
        const id = this.approvingAppId();
        if (!id) return;
        
        this.appApi.approve(id, this.revisedPremium()).subscribe({
            next: () => { 
                this.toast.success('Application approved!'); 
                this.showApproveModal.set(false);
                this.loadApps(); 
            },
            error: err => this.toast.error(err.message || 'Failed to approve')
        });
    }

    openRejectModal(id: number) {
        this.rejectingAppId.set(id);
        this.rejectionReason.set('');
        this.showRejectModal.set(true);
    }

    confirmReject() {
        const id = this.rejectingAppId();
        const reason = this.rejectionReason().trim();
        if (!id || !reason) return;

        this.appApi.reject(id, reason).subscribe({
            next: () => {
                this.toast.warning('Application rejected');
                this.showRejectModal.set(false);
                this.loadApps();
            },
            error: err => this.toast.error(err.message || 'Failed to reject')
        });
    }

    openReasonModal(reason: string) {
        this.viewReasonText.set(reason);
        this.showReasonModal.set(true);
    }

    closeReasonModal() {
        this.showReasonModal.set(false);
        this.viewReasonText.set('');
    }

    viewDocs(appId: number) {
        this.selectedAppId.set(appId);
        this.appDocs.set([]);
        this.showDocsModal.set(true);
        this.documentApi.getDocumentsByApplicationId(appId).subscribe({
            next: (res: any) => {
                let docs = [];
                if (Array.isArray(res)) docs = res;
                else if (res?.data && Array.isArray(res.data)) docs = res.data;
                else if (res?.content && Array.isArray(res.content)) docs = res.content;
                this.appDocs.set(docs);
            },
            error: () => this.toast.error('Failed to load documents')
        });
    }

    getDocUrl(docId: number) {
        return `${environment.apiBase}/documents/download/${docId}`;
    }

    downloadApplication(app: PolicyApplication) {
        this.documentApi.getDocumentsByApplicationId(app.applicationId).subscribe({
            next: (res: any) => {
                let docs = [];
                if (Array.isArray(res)) docs = res;
                else if (res?.data && Array.isArray(res.data)) docs = res.data;
                else if (res?.content && Array.isArray(res.content)) docs = res.content;
                
                if (docs.length === 0) {
                    this.toast.info('No documents found for this application.');
                    return;
                }

                this.toast.success(`Downloading ${docs.length} document(s)...`);
                docs.forEach((doc: any, index: number) => {
                    setTimeout(() => {
                        this.documentApi.downloadDocument(doc.documentId).subscribe({
                            next: (blob) => {
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = doc.fileName || `document_${doc.documentId}`;
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                window.URL.revokeObjectURL(url);
                            },
                            error: () => this.toast.error(`Failed to download ${doc.fileName}`)
                        });
                    }, index * 800); // 800ms delay to prevent browser block
                });
            },
            error: () => this.toast.error('Failed to load documents for download')
        });
    }

    downloadSingleDocument(doc: any) {
        this.documentApi.downloadDocument(doc.documentId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = doc.fileName || `document_${doc.documentId}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                this.toast.success(`Started download: ${doc.fileName}`);
            },
            error: () => this.toast.error(`Failed to download ${doc.fileName}`)
        });
    }

    viewSingleDocument(doc: any) {
        this.documentApi.downloadDocument(doc.documentId).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
                // We don't revoke immediately because it might break the new window in some browsers
                // but usually browsers clone the blob data for the new tab.
                this.toast.info(`Opening ${doc.fileName} in new tab...`);
            },
            error: () => this.toast.error(`Failed to view ${doc.fileName}`)
        });
    }
}
