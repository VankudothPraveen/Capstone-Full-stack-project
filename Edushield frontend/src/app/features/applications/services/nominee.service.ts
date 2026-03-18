import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Nominee } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class NomineeService {
  private base = `${environment.apiBase}/nominees`;

  constructor(private http: HttpClient) {}

  add(nominee: Partial<Nominee>): Observable<Nominee> {
    return this.http.post<ApiResponse<Nominee>>(this.base, nominee).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to add nominee')))
    );
  }

  /** GET /api/nominees/application/{applicationId} - Get nominee for a specific application */
  getByApplicationId(applicationId: number): Observable<Nominee> {
    return this.http.get<ApiResponse<Nominee>>(`${this.base}/application/${applicationId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load nominee')))
    );
  }

  getById(nomineeId: number): Observable<Nominee> {
    return this.http.get<ApiResponse<Nominee>>(`${this.base}/${nomineeId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load nominee')))
    );
  }

  update(nomineeId: number, nominee: Partial<Nominee>): Observable<Nominee> {
    return this.http.put<ApiResponse<Nominee>>(`${this.base}/${nomineeId}`, nominee).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update nominee')))
    );
  }

  delete(nomineeId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${nomineeId}`).pipe(
      map(res => { if (res.success) return; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to delete nominee')))
    );
  }
}
