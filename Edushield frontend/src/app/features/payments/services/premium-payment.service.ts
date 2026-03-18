import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { PremiumPayment } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class PremiumPaymentService {
  private base = `${environment.apiBase}/premium-payments`;

  constructor(private http: HttpClient) { }

  makePayment(payment: Partial<PremiumPayment>): Observable<PremiumPayment> {
    return this.http.post<ApiResponse<PremiumPayment>>(this.base, payment).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to make payment')))
    );
  }

  getMyPayments(page = 0, size = 10): Observable<PaginatedResponse<PremiumPayment>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<PremiumPayment>> | PaginatedResponse<PremiumPayment>>(`${this.base}/my`, { params }).pipe(
      map(res => {
        if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          return (res as ApiResponse<PaginatedResponse<PremiumPayment>>).data;
        }
        return res as PaginatedResponse<PremiumPayment>;
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load payments')))
    );
  }

  getById(paymentId: number): Observable<PremiumPayment> {
    return this.http.get<ApiResponse<PremiumPayment>>(`${this.base}/${paymentId}`).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load payment')))
    );
  }
}
