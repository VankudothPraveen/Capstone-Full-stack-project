import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface HomeStats {
  totalUsers: number;
  totalPolicies: number;
  totalClaimsSettled: number;
  claimApprovalRate: number;
}

// Default fallback stats when API is not accessible
const DEFAULT_STATS: HomeStats = {
  totalUsers: 5000,
  totalPolicies: 7,
  totalClaimsSettled: 2500000, // ₹25 Lakhs
  claimApprovalRate: 95
};

@Injectable({ providedIn: 'root' })
export class HomeStatsService {
  private base = environment.apiBase;

  constructor(private http: HttpClient) {}

  getStats(): Observable<HomeStats> {
    // Use public endpoints that don't require authentication
    return forkJoin({
      policies: this.http.get<any>(`${this.base}/policies?page=0&size=100`).pipe(
        catchError(() => of(null))
      ),
      adminStats: this.http.get<any>(`${this.base}/admin/dashboard`).pipe(
        catchError(() => of(null))
      )
    }).pipe(
      map(({ policies, adminStats }) => {
        // Try to get policy count from public endpoint
        let totalPolicies = DEFAULT_STATS.totalPolicies;
        if (policies) {
          const data = policies?.data || policies;
          if (Array.isArray(data)) {
            totalPolicies = data.length;
          } else if (data?.totalElements) {
            totalPolicies = data.totalElements;
          } else if (data?.content && Array.isArray(data.content)) {
            totalPolicies = data.content.length;
          }
        }

        // Try to get other stats from admin dashboard (if logged in as admin)
        if (adminStats) {
          const data = adminStats?.data || adminStats;
          const approved = data.approvedClaims || 0;
          const pending = data.pendingClaims || 0;
          const total = approved + pending;
          return {
            totalUsers: data.totalChildren || DEFAULT_STATS.totalUsers,
            totalPolicies: totalPolicies || data.activePolicies || data.totalPolicies || DEFAULT_STATS.totalPolicies,
            totalClaimsSettled: data.totalClaimAmount || DEFAULT_STATS.totalClaimsSettled,
            claimApprovalRate: total > 0 ? Math.round((approved / total) * 100) : DEFAULT_STATS.claimApprovalRate
          };
        }

        // Return with at least the policy count from public API
        return {
          ...DEFAULT_STATS,
          totalPolicies: totalPolicies || DEFAULT_STATS.totalPolicies
        };
      }),
      catchError(() => of(DEFAULT_STATS))
    );
  }
}
