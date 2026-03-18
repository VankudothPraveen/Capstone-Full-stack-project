import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Claim } from '../../../core/models/interfaces';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminClaimService {
  private auth = inject(AuthService);
  private get base() {
    return this.auth.isClaimsOfficer() 
      ? `${environment.apiBase}/claims-officer/claims`
      : `${environment.apiBase}/admin/claims`;
  }

  constructor(private http: HttpClient) { }

  getAll(page = 0, size = 10): Observable<Claim[]> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<any>(this.base, { params }).pipe(
      map(res => {
        console.log('Raw claims API response:', JSON.stringify(res, null, 2));
        let claims: Claim[] = [];
        if (Array.isArray(res)) claims = res;
        else if (res?.data && Array.isArray(res.data)) claims = res.data;
        else if (res?.content && Array.isArray(res.content)) claims = res.content;
        else if (res?.data?.content && Array.isArray(res.data.content)) claims = res.data.content;
        // Normalise all possible backend field names → rejectionReason
        return claims.map((c: any) => {
          console.log('Claim before normalisation:', c.claimId, { rejectionReason: c.rejectionReason, reason: c.reason, rejection_reason: c.rejection_reason });
          if (!c.rejectionReason) c.rejectionReason = c.reason ?? c.rejection_reason ?? null;
          return c as Claim;
        });
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load claims')))
    );
  }

  approve(claimId: number, revisedAmount?: number): Observable<Claim> {
    const params = revisedAmount != null ? new HttpParams().set('revisedAmount', revisedAmount.toString()) : new HttpParams();
    return this.http.put<ApiResponse<Claim>>(`${this.base}/${claimId}/approve`, {}, { params }).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to approve claim')))
    );
  }

  reject(claimId: number, reason: string): Observable<Claim> {
    // Try both query param AND request body to maximize compatibility
    const params = new HttpParams()
      .set('rejectionReason', reason)
      .set('reason', reason);
    const body = { rejectionReason: reason, reason: reason };
    
    return this.http.put<ApiResponse<Claim>>(`${this.base}/${claimId}/reject`, body, { params }).pipe(
      map(res => { 
        console.log('Reject response:', res);
        if (res.success) return res.data; 
        throw new Error(res.message); 
      }),
      catchError(err => {
        console.error('Reject error:', err);
        return throwError(() => new Error(err?.error?.message || err?.message || 'Failed to reject claim'));
      })
    );
  }
}
