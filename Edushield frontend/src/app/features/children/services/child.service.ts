import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Child } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class ChildService {
  private base = `${environment.apiBase}/children`;

  constructor(private http: HttpClient) {}

  register(child: Partial<Child>): Observable<Child> {
    return this.http.post<ApiResponse<Child>>(this.base, child).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to register child')))
    );
  }

  getMyChildren(page = 0, size = 10): Observable<PaginatedResponse<Child>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Child>> | PaginatedResponse<Child>>(`${this.base}/my`, { params }).pipe(
      map(res => {
        // Handle both wrapped (ApiResponse<PaginatedResponse>) and direct (PaginatedResponse) formats
        if ('success' in res && 'data' in res && Array.isArray((res as any).data)) {
          // Direct PaginatedResponse format
          return res as PaginatedResponse<Child>;
        } else if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          // Wrapped ApiResponse<PaginatedResponse> format
          return (res as ApiResponse<PaginatedResponse<Child>>).data;
        }
        // Fallback - treat as direct response
        return res as PaginatedResponse<Child>;
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load children')))
    );
  }

  getById(childId: number): Observable<Child> {
    return this.http.get<ApiResponse<Child>>(`${this.base}/${childId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load child')))
    );
  }

  update(childId: number, child: Partial<Child>): Observable<Child> {
    return this.http.put<ApiResponse<Child>>(`${this.base}/${childId}`, child).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update child')))
    );
  }

  delete(childId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${childId}`).pipe(
      map(res => { if (res.success) return; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to delete child')))
    );
  }
}
