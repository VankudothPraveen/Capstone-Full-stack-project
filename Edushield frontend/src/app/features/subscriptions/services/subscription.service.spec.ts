import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubscriptionService } from './subscription.service';
import { environment } from '../../../../environments/environment';
import { PolicySubscription } from '../../../core/models/interfaces';

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let httpMock: HttpTestingController;

  const base = `${environment.apiBase}/subscriptions`;

  const mockSub: PolicySubscription = {
    subscriptionId: 1,
    subscriptionNumber: 'SUB-001',
    premiumAmount: 1200,
    status: 'ACTIVE',
    startDate: '2023-01-01' as any,
    endDate: '2033-01-01' as any,
    maturityDate: '2033-01-01' as any,
    coverageAmount: 500000,
    totalPaidAmount: 12000,
    applicationId: 1,
    policyName: 'Gold Plan',
    childName: 'Test Child',
  } as PolicySubscription;

  const mockPaginatedResponse = {
    success: true,
    data: {
      data: [mockSub],
      pageNumber: 0,
      pageSize: 20,
      totalElements: 1,
      totalPages: 1,
      isFirst: true,
      isLast: true
    }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubscriptionService],
    });
    service = TestBed.inject(SubscriptionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMySubscriptions', () => {
    it('should fetch paginated subscriptions (wrapped format)', () => {
      service.getMySubscriptions(0, 20).subscribe(res => {
        expect(res.data[0]).toEqual(mockSub);
      });
      const req = httpMock.expectOne(`${base}/my?page=0&size=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle direct response format', () => {
      service.getMySubscriptions().subscribe(res => {
        expect(res.data[0]).toEqual(mockSub);
      });
      const req = httpMock.expectOne(`${base}/my?page=0&size=20`);
      req.flush(mockPaginatedResponse.data);
    });
  });

  describe('getById', () => {
    it('should fetch a specific subscription by ID', () => {
      service.getById(1).subscribe(res => {
        expect(res).toEqual(mockSub);
      });
      const req = httpMock.expectOne(`${base}/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockSub });
    });

    it('should throw error when success is false', () => {
      service.getById(99).subscribe({
        error: err => expect(err.message).toBe('Failed to fetch subscription')
      });
      const req = httpMock.expectOne(`${base}/99`);
      req.flush({ success: false, message: 'Subscription not found' });
    });
  });

  describe('getByApplicationId', () => {
    it('should fetch subscription linked to applicationId', () => {
      service.getByApplicationId(5).subscribe(res => {
        expect(res.subscriptionId).toBe(1);
      });
      const req = httpMock.expectOne(`${base}/application/5`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockSub });
    });

    it('should handle not found error for application subscriptions', () => {
      service.getByApplicationId(999).subscribe({
        error: err => expect(err.message).toBe('Subscription not found for this application')
      });
      const req = httpMock.expectOne(`${base}/application/999`);
      req.flush(null, { status: 404, statusText: 'Not Found' });
    });
  });
});
