import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminClaimService } from '../../services/admin-claim.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Claim } from '../../../../core/models/interfaces';
import { DocumentService } from '../../../document/services/document.service';

@Component({
  selector: 'app-claims-officer-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './claims-officer-dashboard.component.html'
})
export class ClaimsOfficerDashboardComponent implements OnInit {
  private claimApi = inject(AdminClaimService);
  private documentApi = inject(DocumentService);
  toast = inject(ToastService);

  pendingClaims = signal<Claim[]>([]);

  // Docs Modal State
  showDocsModal = signal(false);
  selectedClaimId = signal<number | null>(null);
  claimDocs = signal<any[]>([]);

  pendingCount = computed(() => this.pendingClaims().length);
  totalClaimValue = signal(0);

  ngOnInit() {
    this.loadClaims();
  }

  loadClaims() {
    this.claimApi.getAll(0, 100).subscribe({
      next: (data: any) => {
        let claims: any[] = [];
        if (Array.isArray(data)) claims = data;
        else if (data?.data && Array.isArray(data.data)) claims = data.data;
        else if (data?.content && Array.isArray(data.content)) claims = data.content;

        const pending = claims.filter((c: any) => c.status === 'PENDING' || c.status === 'SUBMITTED');
        this.pendingClaims.set(pending);
        this.totalClaimValue.set(pending.reduce((acc: number, curr: any) => acc + (curr.claimAmount || 0), 0));
      },
      error: () => {
        this.pendingClaims.set([]);
        this.totalClaimValue.set(0);
      }
    });
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

  downloadAllDocuments(claimId: number) {
    this.documentApi.getDocumentsByClaimId(claimId).subscribe({
      next: (res: any) => {
        let docs = [];
        if (Array.isArray(res)) docs = res;
        else if (res?.data && Array.isArray(res.data)) docs = res.data;
        else if (res?.content && Array.isArray(res.content)) docs = res.content;

        if (docs.length === 0) {
          this.toast.info('No documents found.');
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

  approveClaim(id: number) {
    this.claimApi.approve(id).subscribe({
      next: () => {
        this.toast.success('Claim approved successfully');
        this.loadClaims();
      },
      error: (err: any) => this.toast.error(err.message || 'Failed to approve claim')
    });
  }
}
