import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DocumentResponse {
    documentId: number;
    documentType: string;
    fileName: string;
    uploadDate: string;
    policyApplicationId?: number;
    claimId?: number;
    uploadedByUserId: number;
}

export interface PolicyDocumentRequirementResponse {
    id: number;
    policyId: number;
    documentType: string;
    stage: string;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentService {
    private http = inject(HttpClient);
    // Assuming environment.apiBase exists, otherwise just hardcode /api
    private baseUrl = (environment as any).apiBase ? `${(environment as any).apiBase}/documents` : 'http://localhost:8080/api/documents';
    private reqUrl = (environment as any).apiBase ? `${(environment as any).apiBase}/policy-document-requirements` : 'http://localhost:8080/api/policy-document-requirements';

    getRequirements(policyId: number, stage: string): Observable<any> {
        return this.http.get<any>(`${this.reqUrl}/policy/${policyId}/stage/${stage}`);
    }

    uploadDocument(file: File, applicationId: number | null, claimId: number | null, documentType: string, userId: number): Observable<any> {
        const formData = new FormData();
        formData.append('file', file);
        if (applicationId) formData.append('applicationId', applicationId.toString());
        if (claimId) formData.append('claimId', claimId.toString());
        formData.append('documentType', documentType);
        formData.append('userId', userId.toString());

        return this.http.post<any>(`${this.baseUrl}/upload`, formData);
    }

    getDocumentsByClaimId(claimId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/claim/${claimId}`);
    }

    getDocumentsByApplicationId(applicationId: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/application/${applicationId}`);
    }

    downloadDocument(documentId: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/download/${documentId}`, { responseType: 'blob' });
    }
}
