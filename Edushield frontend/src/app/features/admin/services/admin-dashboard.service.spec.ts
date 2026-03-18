import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminDashboardService } from './admin-dashboard.service';
import { environment } from '../../../../environments/environment';
import { DashboardMetrics, MonthlyRevenueReport } from '../../../core/models/interfaces';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;
  let httpMock: HttpTestingController;

  const base = `${environment.apiBase}/admin/dashboard`;

  const mockMetrics: DashboardMetrics = {
    totalPolicies: 10,
    activePolicies: 8,
    totalPremiumPaid: 500000,
    upcomingPayments: 3,
    totalChildren: 20,
    pendingClaims: 10,
    approvedClaims: 15,
    totalClaimAmount: 200000,
  } as DashboardMetrics;

  const mockRevenue: MonthlyRevenueReport[] = [
    { month: 'January', year: 2025, totalRevenue: 45000, totalPayments: 10, totalClaims: 2, netRevenue: 43000 } as MonthlyRevenueReport,
    { month: 'February', year: 2025, totalRevenue: 52000, totalPayments: 12, totalClaims: 3, netRevenue: 49000 } as MonthlyRevenueReport,
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminDashboardService],
    });
    service = TestBed.inject(AdminDashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMetrics', () => {
    it('should fetch dashboard metrics', () => {
      service.getMetrics().subscribe(res => {
        expect(res.totalPolicies).toBe(10);
        expect(res.totalPremiumPaid).toBe(500000);
      });
      const req = httpMock.expectOne(base);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockMetrics });
    });

    it('should handle metrics load failure', () => {
      service.getMetrics().subscribe({
        error: (err) => expect(err.message).toBe('Server Down')
      });
      const req = httpMock.expectOne(base);
      req.flush({ message: 'Server Down' }, { status: 503, statusText: 'Service Unavailable' });
    });
  });

  describe('getMonthlyRevenue', () => {
    it('should fetch monthly revenue for a given year', () => {
      service.getMonthlyRevenue(2025).subscribe(res => {
        expect(res.length).toBe(2);
        expect(res[0].month).toBe('January');
      });
      const req = httpMock.expectOne(`${base}/revenue?year=2025`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockRevenue });
    });
  });
});
