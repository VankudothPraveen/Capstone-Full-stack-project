import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { Claim } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class ClaimService {
  private base = `${environment.apiBase}/claims`;

  constructor(private http: HttpClient) { }

  fileClaim(claim: Partial<Claim>): Observable<Claim> {
    return this.http.post<ApiResponse<Claim>>(this.base, claim).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to file claim')))
    );
  }

  getMyClaims(page = 0, size = 10): Observable<PaginatedResponse<Claim>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Claim>> | PaginatedResponse<Claim>>(`${this.base}/my`, { params }).pipe(
      map(res => {
        let paged: PaginatedResponse<Claim>;
        if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
          paged = (res as ApiResponse<PaginatedResponse<Claim>>).data;
        } else {
          paged = res as PaginatedResponse<Claim>;
        }
        // Normalise all possible backend field names → rejectionReason
        if (paged?.data) {
          paged.data = paged.data.map((c: any) => {
            if (!c.rejectionReason) c.rejectionReason = c.reason ?? c.rejection_reason ?? null;
            return c as Claim;
          });
        }
        return paged;
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load claims')))
    );
  }

  getById(claimId: number): Observable<Claim> {
    return this.http.get<ApiResponse<Claim>>(`${this.base}/${claimId}`).pipe(
      map(res => {
        console.log('Claim detail raw response:', JSON.stringify(res, null, 2));
        if (res.success) {
          const c: any = res.data;
          console.log('Claim fields:', { rejectionReason: c.rejectionReason, reason: c.reason, rejection_reason: c.rejection_reason });
          // Normalise all possible backend field names → rejectionReason
          if (!c.rejectionReason) c.rejectionReason = c.reason ?? c.rejection_reason ?? null;
          console.log('After normalisation:', c.rejectionReason);
          return c as Claim;
        }
        throw new Error(res.message);
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load claim')))
    );
  }
}
