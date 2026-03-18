import { Component, inject, computed, signal, OnInit } from '@angular/core';
import { AdminClaimService } from '../../services/admin-claim.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Claim } from '../../../../core/models/interfaces';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../../document/services/document.service';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-claim-management', standalone: true, imports: [DatePipe, FormsModule],
    templateUrl: './claim-management.component.html'
})
export class ClaimManagementComponent implements OnInit {
    private claimApi = inject(AdminClaimService);
    private documentApi = inject(DocumentService);
    auth = inject(AuthService);
    toast = inject(ToastService);
    private route = inject(ActivatedRoute);

    activeFilter = signal('All');
    filters = ['All', 'PENDING', 'SUBMITTED', 'APPROVED', 'PAID', 'REJECTED'];
    searchQuery = signal('');
    allClaims = signal<Claim[]>([]);

    // Reject modal state
    showRejectModal = signal(false);
    rejectingClaimId = signal<number | null>(null);
    rejectionReason = signal('');

    // Approve modal state
    showApproveModal = signal(false);
    approvingClaimId = signal<number | null>(null);
    revisedAmount = signal<number | null>(null);

    // Documents modal state
    showDocsModal = signal(false);
    selectedClaimId = signal<number | null>(null);
    claimDocs = signal<any[]>([]);

    // View reason modal state
    showReasonModal = signal(false);
    viewReasonText = signal('');

    ngOnInit() { 
        this.route.queryParams.subscribe((params: any) => {
            if (params['claimId']) {
                this.searchQuery.set(params['claimId']);
            }
        });
        this.loadClaims(); 
    }

    viewDocs(claimId: number) {
        this.selectedClaimId.set(claimId);
        this.claimDocs.set([]);
        this.showDocsModal.set(true);
        this.documentApi.getDocumentsByClaimId(claimId).subscribe({
            next: (res: any) => {
                let docs = [];
                if (Array.isArray(res)) docs = res;
                else if (res?.data && Array.isArray(res.data)) docs = res.data;
                else if (res?.content && Array.isArray(res.content)) docs = res.content;
                this.claimDocs.set(docs);
            },
            error: () => {
                this.toast.error('Failed to load documents');
                this.showDocsModal.set(false);
            }
        });
    }

    closeDocsModal() {
        this.showDocsModal.set(false);
        this.selectedClaimId.set(null);
        this.claimDocs.set([]);
    }

    getDocUrl(id: number) {
        return `${environment.apiBase}/documents/download/${id}`;
    }

    filteredClaims = computed(() => {
        const claims = this.allClaims();
        const query = this.searchQuery().toLowerCase().trim();
        const filter = this.activeFilter();

        return claims.filter(c => {
            const matchesFilter = filter === 'All' || c.status === filter;
            const matchesSearch = !query || 
                c.claimType?.toLowerCase().includes(query) || 
                c.claimId.toString().includes(query) ||
                c.policyName?.toLowerCase().includes(query) ||
                c.policyNumber?.toLowerCase().includes(query) ||
                c.subscriptionNumber?.toLowerCase().includes(query);
            return matchesFilter && matchesSearch;
        });
    });

    private loadClaims() {
        this.claimApi.getAll(0, 500).subscribe({
            next: (data: any) => this.allClaims.set(data),
            error: () => this.allClaims.set([])
        });
    }

    getStatusCls(s: string) {
        const m: Record<string, string> = { APPROVED: 'badge-success', PAID: 'badge-gold', PENDING: 'badge-warning', SUBMITTED: 'badge-warning', REJECTED: 'badge-danger' };
        return m[s] || 'badge-gray';
    }

    openApproveModal(id: number) {
        const claim = this.allClaims().find(c => c.claimId === id);
        this.approvingClaimId.set(id);
        this.revisedAmount.set(claim ? claim.claimAmount : null);
        this.showApproveModal.set(true);
    }

    cancelApprove() {
        this.showApproveModal.set(false);
        this.approvingClaimId.set(null);
        this.revisedAmount.set(null);
    }

    confirmApprove() {
        const id = this.approvingClaimId();
        if (!id) return;
        const amount = this.revisedAmount();
        this.claimApi.approve(id, amount !== null ? amount : undefined).subscribe({
            next: () => { 
                this.toast.success('Claim approved!'); 
                this.cancelApprove();
                this.loadClaims(); 
            },
            error: err => {
                this.toast.error(err.message || 'Failed to approve');
                this.cancelApprove();
            }
        });
    }

    openRejectModal(id: number) {
        this.rejectingClaimId.set(id);
        this.rejectionReason.set('');
        this.showRejectModal.set(true);
    }

    cancelReject() {
        this.showRejectModal.set(false);
        this.rejectingClaimId.set(null);
        this.rejectionReason.set('');
    }

    confirmReject() {
        const id = this.rejectingClaimId();
        const reason = this.rejectionReason().trim();
        if (!id || !reason) { this.toast.error('Please enter a rejection reason.'); return; }
        this.claimApi.reject(id, reason).subscribe({
            next: () => {
                this.toast.warning('Claim rejected');
                this.cancelReject();
                this.loadClaims();
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
                this.toast.info(`Opening ${doc.fileName} in new tab...`);
            },
            error: () => this.toast.error(`Failed to view ${doc.fileName}`)
        });
    }

    downloadAllDocuments(claimId: number) {
        this.documentApi.getDocumentsByClaimId(claimId).subscribe({
            next: (res: any) => {
                let docs = [];
                if (Array.isArray(res)) docs = res;
                else if (res?.data && Array.isArray(res.data)) docs = res.data;
                else if (res?.content && Array.isArray(res.content)) docs = res.content;
                
                if (docs.length === 0) {
                    this.toast.info('No documents found for this claim.');
                    return;
                }

                this.toast.success(`Downloading ${docs.length} document(s)...`);
                docs.forEach((doc: any, index: number) => {
                    setTimeout(() => {
                        this.downloadSingleDocument(doc);
                    }, index * 800);
                });
            },
            error: () => this.toast.error('Failed to load documents for download')
        });
    }
}
