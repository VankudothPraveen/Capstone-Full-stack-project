import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminApplicationService } from '../../services/admin-application.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicyApplication } from '../../../../core/models/interfaces';
import { FormsModule } from '@angular/forms';
import { RiskEstimatorService } from '../../../applications/services/risk-estimator.service';
import { DocumentService } from '../../../document/services/document.service';

@Component({
  selector: 'app-underwriter-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './underwriter-dashboard.component.html'
})
export class UnderwriterDashboardComponent implements OnInit {
  private appApi = inject(AdminApplicationService);
  private documentApi = inject(DocumentService);
  toast = inject(ToastService);
  private riskApi = inject(RiskEstimatorService);

  pendingApps = signal<PolicyApplication[]>([]);
  avgRiskScore = signal(0);

  // Quick Calculator State
  occupations = this.riskApi.OCCUPATIONS;
  calcBasePremium = signal<number | null>(1000);
  calcAge = signal<number | null>(35);
  calcOccupation = signal<string>('Software Engineer');
  calcIncome = signal<number | null>(1000000);
  calcCoverage = signal<number | null>(4000000);

  // Docs Modal State
  showDocsModal = signal(false);
  selectedAppId = signal<number | null>(null);
  appDocs = signal<any[]>([]);

  calcResult = computed(() => {
    const baseParam = this.calcBasePremium();
    const age = this.calcAge();
    const occ = this.calcOccupation();
    const inc = this.calcIncome();
    const cov = this.calcCoverage();

    if (!baseParam || !age || !occ || !inc || !cov) return null;

    let score = 0;

    // Age Risk
    if (age <= 30) score += 10;
    else if (age <= 40) score += 15;
    else if (age <= 50) score += 25;
    else score += 40;

    // Occupation Risk
    const highRisk = ['Driver', 'Mechanic', 'Security Guard', 'Factory Worker', 'Construction Worker'];
    const vHighRisk = ['Army', 'Police Officer', 'Firefighter', 'Pilot', 'Sailor'];
    const medRisk = ['Business Owner', 'Manager', 'Shopkeeper', 'Farmer'];
    if (vHighRisk.some(o => occ.includes(o))) score += 30;
    else if (highRisk.some(o => occ.includes(o))) score += 25;
    else if (medRisk.some(o => occ.includes(o))) score += 15;
    else score += 10;

    // Income Risk
    if (inc > 1500000) score += 5;
    else if (inc >= 800000) score += 10;
    else if (inc >= 400000) score += 20;
    else score += 30;

    // Coverage Risk
    if (cov <= 1000000) score += 5;
    else if (cov <= 2500000) score += 10;
    else if (cov <= 5000000) score += 20;
    else score += 30;

    score = Math.min(score, 100);

    let cat = 'LOW';
    let mult = 1.0;
    if (score > 80) { cat = 'VERY_HIGH'; mult = 2.0; }
    else if (score > 60) { cat = 'HIGH'; mult = 1.5; }
    else if (score > 30) { cat = 'MEDIUM'; mult = 1.2; }

    return {
      riskScore: score,
      riskCategory: cat,
      calculatedPremium: Math.round(baseParam * mult)
    };
  });

  getRiskColor(cat: string) {
    return this.riskApi.getRiskCategoryColor(cat);
  }

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.appApi.getAll(0, 100).subscribe({
      next: (res: any) => {
        let apps: any[] = [];
        if (Array.isArray(res)) apps = res;
        else if (res?.data && Array.isArray(res.data)) apps = res.data;
        else if (res?.content && Array.isArray(res.content)) apps = res.content;

        const pending = apps.filter((a: any) => a.status === 'PENDING' || a.status === 'SUBMITTED');
        this.pendingApps.set(pending);

        const scoredApps = pending.filter((a: any) => a.riskScore != null);
        if (scoredApps.length > 0) {
          const avg = scoredApps.reduce((acc: number, curr: any) => acc + (curr.riskScore || 0), 0) / scoredApps.length;
          this.avgRiskScore.set(Math.round(avg));
        }
      },
      error: () => this.pendingApps.set([])
    });
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
      error: () => {
        this.toast.error('Failed to load documents');
        this.showDocsModal.set(false);
      }
    });
  }

  downloadAllDocuments(appId: number) {
    this.documentApi.getDocumentsByApplicationId(appId).subscribe({
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
}
