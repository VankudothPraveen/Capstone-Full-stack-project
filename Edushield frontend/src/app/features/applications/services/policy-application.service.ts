import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { PolicyApplication } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class PolicyApplicationService {
  private base = `${environment.apiBase}/policy-applications`;

  constructor(private http: HttpClient) { }

  create(application: Partial<PolicyApplication>): Observable<PolicyApplication> {
    return this.http.post<ApiResponse<PolicyApplication>>(this.base, application).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to create application')))
    );
  }

  getMyApplications(page = 0, size = 10): Observable<PaginatedResponse<PolicyApplication>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<PolicyApplication>> | PaginatedResponse<PolicyApplication>>(`${this.base}/my`, { params }).pipe(
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

  /** PUT /api/policy-applications/{applicationId}/cancel */
  cancel(applicationId: number): Observable<PolicyApplication> {
    return this.http.put<ApiResponse<PolicyApplication>>(`${this.base}/${applicationId}/cancel`, {}).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to cancel application')))
    );
  }

  downloadCertificate(applicationId: number): Observable<Blob> {
    return this.http.get(`${this.base}/${applicationId}/certificate`, { responseType: 'blob' });
  }
}
