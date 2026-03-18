import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Policy } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class AdminPolicyService {
  private base = `${environment.apiBase}/admin/policies`;

  constructor(private http: HttpClient) { }

  create(policy: Partial<Policy>): Observable<Policy> {
    return this.http.post<ApiResponse<Policy>>(this.base, policy).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => {
        const errBody = err?.error;
        let msg = 'Failed to create policy';
        if (errBody?.fieldErrors?.length) {
          msg = errBody.fieldErrors.map((f: any) => `${f.field}: ${f.message}`).join('; ');
        } else if (errBody?.message) {
          msg = errBody.message;
        } else if (err?.message) {
          msg = err.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  getAll(page = 0, size = 10): Observable<PaginatedResponse<Policy>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Policy>> | PaginatedResponse<Policy>>(this.base, { params }).pipe(
      map(res => {
        if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          return (res as ApiResponse<PaginatedResponse<Policy>>).data;
        }
        return res as PaginatedResponse<Policy>;
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load policies')))
    );
  }

  getById(policyId: number): Observable<Policy> {
    return this.http.get<ApiResponse<Policy>>(`${this.base}/${policyId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load policy')))
    );
  }

  update(policyId: number, policy: Partial<Policy>): Observable<Policy> {
    return this.http.put<ApiResponse<Policy>>(`${this.base}/${policyId}`, policy).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => {
        const errBody = err?.error;
        let msg = 'Failed to update policy';
        if (errBody?.fieldErrors?.length) {
          msg = errBody.fieldErrors.map((f: any) => `${f.field}: ${f.message}`).join('; ');
        } else if (errBody?.message) {
          msg = errBody.message;
        } else if (err?.message) {
          msg = err.message;
        }
        return throwError(() => new Error(msg));
      })
    );
  }

  delete(policyId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${policyId}`).pipe(
      map(res => { if (res.success) return; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to delete policy')))
    );
  }

  activate(policyId: number): Observable<Policy> {
    return this.http.put<ApiResponse<Policy>>(`${this.base}/${policyId}/activate`, {}).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to activate policy')))
    );
  }

  deactivate(policyId: number): Observable<Policy> {
    return this.http.put<ApiResponse<Policy>>(`${this.base}/${policyId}/deactivate`, {}).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to deactivate policy')))
    );
  }
}
