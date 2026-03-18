import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Policy } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class PolicyService {
  private base = `${environment.apiBase}/policies`;

  constructor(private http: HttpClient) { }

  getAll(page = 0, size = 10): Observable<PaginatedResponse<Policy>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Policy>> | PaginatedResponse<Policy>>(this.base, { params }).pipe(
      map(res => {
        // Handle both wrapped (ApiResponse<PaginatedResponse>) and direct (PaginatedResponse) formats
        if ('success' in res && 'data' in res && Array.isArray((res as any).data)) {
          // Direct PaginatedResponse format
          return res as PaginatedResponse<Policy>;
        } else if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          // Wrapped ApiResponse<PaginatedResponse> format
          return (res as ApiResponse<PaginatedResponse<Policy>>).data;
        }
        // Fallback - treat as direct response
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
}
