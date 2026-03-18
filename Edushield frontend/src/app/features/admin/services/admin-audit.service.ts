import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminAuditService {
  private http = inject(HttpClient);
  private auditBase = `${environment.apiBase}/admin/audit-logs`;
  private exportBase = `${environment.apiBase}/admin/export`;

  getAuditLogs(page = 0, size = 20, filters?: {
    action?: string;
    email?: string;
    startDate?: string;
    endDate?: string;
  }): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters?.action) params = params.set('action', filters.action);
    if (filters?.email) params = params.set('email', filters.email);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);

    return this.http.get<ApiResponse<any>>(`${this.auditBase}`, { params }).pipe(map(res => res.data));
  }

  getLogsByUser(userId: number, page = 0, size = 20): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.auditBase}/user/${userId}`, { params }).pipe(map(res => res.data));
  }

  getLogsByAction(action: string, page = 0, size = 20): Observable<any> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.auditBase}/action/${action}`, { params }).pipe(map(res => res.data));
  }

  getDistinctActions(): Observable<string[]> {
    return this.http.get<ApiResponse<string[]>>(`${this.auditBase}/actions`).pipe(map(res => res.data));
  }

  // ─── Export Methods ──────────────────────────────────────────────

  exportUsers(): Observable<Blob> {
    return this.http.get(`${this.exportBase}/users`, { responseType: 'blob' });
  }

  exportPolicies(): Observable<Blob> {
    return this.http.get(`${this.exportBase}/policies`, { responseType: 'blob' });
  }

  exportApplications(): Observable<Blob> {
    return this.http.get(`${this.exportBase}/applications`, { responseType: 'blob' });
  }

  exportClaims(): Observable<Blob> {
    return this.http.get(`${this.exportBase}/claims`, { responseType: 'blob' });
  }

  exportAuditLogs(): Observable<Blob> {
    return this.http.get(`${this.exportBase}/audit-logs`, { responseType: 'blob' });
  }
}
