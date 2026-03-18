import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { PolicyApplication } from '../../../core/models/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminApplicationService {
  private auth = inject(AuthService);
  private get base() {
    return this.auth.isUnderwriter() 
      ? `${environment.apiBase}/underwriter/applications`
      : `${environment.apiBase}/admin/policy-applications`;
  }

  constructor(private http: HttpClient) { }

  getAll(page = 0, size = 10): Observable<PaginatedResponse<PolicyApplication>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<PolicyApplication>> | PaginatedResponse<PolicyApplication>>(this.base, { params }).pipe(
      map(res => {
        if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          return (res as ApiResponse<PaginatedResponse<PolicyApplication>>).data;
        }
        return res as PaginatedResponse<PolicyApplication>;
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load applications')))
    );
  }

  getById(applicationId: number): Observable<PolicyApplication> {
    return this.http.get<ApiResponse<PolicyApplication>>(`${this.base}/${applicationId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load application')))
    );
  }

  approve(applicationId: number, revisedPremium?: number | null): Observable<PolicyApplication> {
    let params = new HttpParams();
    if (revisedPremium) {
      params = params.set('revisedPremium', revisedPremium.toString());
    }
    return this.http.put<ApiResponse<PolicyApplication>>(`${this.base}/${applicationId}/approve`, {}, { params }).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to approve application')))
    );
  }

  reject(applicationId: number, rejectionReason: string = ''): Observable<PolicyApplication> {
    const params = new HttpParams().set('rejectionReason', rejectionReason);
    return this.http.put<ApiResponse<PolicyApplication>>(`${this.base}/${applicationId}/reject`, {}, { params }).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to reject application')))
    );
  }

  updateStatus(applicationId: number, status: string): Observable<PolicyApplication> {
    return this.http.put<ApiResponse<PolicyApplication>>(`${this.base}/${applicationId}/status`, { status }).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update status')))
    );
  }
}
