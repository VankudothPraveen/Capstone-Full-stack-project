import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BenefitCalculation } from '../../../core/models/interfaces';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BenefitCalculationService {
    private http = inject(HttpClient);
    private base = `${environment.apiBase}/benefit-calculations`;

    /** GET /api/benefit-calculations/my - Get current user's benefit calculations */
    getMyCalculations(page = 0, size = 20): Observable<PaginatedResponse<BenefitCalculation>> {
        return this.http.get<PaginatedResponse<BenefitCalculation>>(`${this.base}/my`, { params: { page, size } }).pipe(
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to fetch benefit calculations')))
        );
    }

    /** GET /api/benefit-calculations/{id} - Get calculation by ID */
    getById(id: number): Observable<BenefitCalculation> {
        return this.http.get<ApiResponse<BenefitCalculation>>(`${this.base}/${id}`).pipe(
            map(res => { if (res.success) return res.data; throw new Error(res.message); }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to fetch calculation')))
        );
    }

    /** GET /api/benefit-calculations/subscription/{subscriptionId} - Get calculations for a subscription */
    getBySubscriptionId(subscriptionId: number): Observable<BenefitCalculation[]> {
        return this.http.get<ApiResponse<BenefitCalculation[]>>(`${this.base}/subscription/${subscriptionId}`).pipe(
            map(res => { if (res.success) return res.data; throw new Error(res.message); }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to fetch calculations')))
        );
    }

    /** POST /api/benefit-calculations/calculate - Trigger a new benefit calculation */
    calculate(subscriptionId: number, benefitType: string): Observable<BenefitCalculation> {
        return this.http.post<ApiResponse<BenefitCalculation>>(`${this.base}/calculate`, { subscriptionId, benefitType }).pipe(
            map(res => { if (res.success) return res.data; throw new Error(res.message); }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to calculate benefit')))
        );
    }
}
