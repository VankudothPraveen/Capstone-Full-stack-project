import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAnalyticsService } from './admin-analytics.service';
import { environment } from '../../../../environments/environment';

describe('AdminAnalyticsService', () => {
  let service: AdminAnalyticsService;
  let httpMock: HttpTestingController;

  const baseUrl = `${environment.apiBase}/admin/analytics`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminAnalyticsService],
    });
    service = TestBed.inject(AdminAnalyticsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch overview analytics', () => {
    const mockData = { totalPolicies: 10, activeUsers: 50 };
    service.getOverview().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/overview`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockData });
  });

  it('should fetch revenue analytics', () => {
    const mockData = { totalRevenue: 100000 };
    service.getRevenue().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/revenue`);
    req.flush({ success: true, data: mockData });
  });

  it('should fetch claims analytics', () => {
    const mockData = { totalClaims: 25, approvedClaims: 20 };
    service.getClaims().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/claims`);
    req.flush({ success: true, data: mockData });
  });

  it('should fetch applications analytics', () => {
    const mockData = { pendingApplications: 5 };
    service.getApplications().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/applications`);
    req.flush({ success: true, data: mockData });
  });

  it('should fetch policy analytics', () => {
    const mockData = { activePolicies: 30 };
    service.getPolicies().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/policies`);
    req.flush({ success: true, data: mockData });
  });

  it('should fetch users analytics', () => {
    const mockData = { totalUsers: 200 };
    service.getUsers().subscribe(data => {
      expect(data).toEqual(mockData);
    });
    const req = httpMock.expectOne(`${baseUrl}/users`);
    req.flush({ success: true, data: mockData });
  });
});
