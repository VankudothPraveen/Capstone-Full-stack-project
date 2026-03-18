import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PolicySubscription } from '../../../core/models/interfaces';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SubscriptionService {
    private http = inject(HttpClient);
    private base = `${environment.apiBase}/subscriptions`;

    /** GET /api/subscriptions/my - Get current user's subscriptions */
    getMySubscriptions(page = 0, size = 20): Observable<PaginatedResponse<PolicySubscription>> {
        return this.http.get<ApiResponse<PaginatedResponse<PolicySubscription>> | PaginatedResponse<PolicySubscription>>(`${this.base}/my`, { params: { page, size } }).pipe(
            map(res => {
                if ('success' in res && 'data' in res && !Array.isArray((res as any).data)) {
                    return (res as ApiResponse<PaginatedResponse<PolicySubscription>>).data;
                }
                return res as PaginatedResponse<PolicySubscription>;
            }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to fetch subscriptions')))
        );
    }

    /** GET /api/subscriptions/{id} - Get subscription by ID */
    getById(id: number): Observable<PolicySubscription> {
        return this.http.get<ApiResponse<PolicySubscription>>(`${this.base}/${id}`).pipe(
            map(res => { if (res.success) return res.data; throw new Error(res.message); }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Failed to fetch subscription')))
        );
    }

    /** GET /api/subscriptions/application/{applicationId} - Get subscription by application ID (after approval) */
    getByApplicationId(applicationId: number): Observable<PolicySubscription> {
        return this.http.get<ApiResponse<PolicySubscription>>(`${this.base}/application/${applicationId}`).pipe(
            map(res => { if (res.success) return res.data; throw new Error(res.message); }),
            catchError(err => throwError(() => new Error(err?.error?.message || 'Subscription not found for this application')))
        );
    }
}
