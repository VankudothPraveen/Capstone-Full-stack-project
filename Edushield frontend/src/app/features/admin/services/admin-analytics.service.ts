import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminAnalyticsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBase}/admin/analytics`;

  getOverview(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/overview`).pipe(map(res => res.data));
  }

  getRevenue(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/revenue`).pipe(map(res => res.data));
  }

  getClaims(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/claims`).pipe(map(res => res.data));
  }

  getApplications(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/applications`).pipe(map(res => res.data));
  }

  getPolicies(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/policies`).pipe(map(res => res.data));
  }

  getUsers(): Observable<any> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/users`).pipe(map(res => res.data));
  }
}
