import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { DashboardMetrics, MonthlyRevenueReport } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private base = `${environment.apiBase}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<DashboardMetrics> {
    return this.http.get<ApiResponse<DashboardMetrics>>(this.base).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load metrics')))
    );
  }

  getMonthlyRevenue(year: number): Observable<MonthlyRevenueReport[]> {
    const params = new HttpParams().set('year', year);
    return this.http.get<ApiResponse<MonthlyRevenueReport[]>>(`${this.base}/revenue`, { params }).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load revenue data')))
    );
  }
}
