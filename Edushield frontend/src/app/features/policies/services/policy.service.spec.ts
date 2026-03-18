import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';
import { environment } from '../../../../environments/environment';
import { Policy } from '../../../core/models/interfaces';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;

  const mockPolicies: Policy[] = [
    { policyId: 1, policyName: 'Policy A', basePremium: 500, durationYears: 10, isActive: true } as Policy,
    { policyId: 2, policyName: 'Policy B', basePremium: 1000, durationYears: 20, isActive: true } as Policy,
  ];

  const mockPaginatedResponse = {
    data: mockPolicies,
    pageNumber: 0,
    pageSize: 10,
    totalElements: 2,
    totalPages: 1,
    isFirst: true,
    isLast: true,
    success: true, // Mocking the direct PaginatedResponse format expected by backend
    message: 'Success'
  };

  const mockApiResponse = {
    success: true,
    message: 'Policy found',
    data: mockPolicies[0]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PolicyService]
    });

    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should retrieve a paginated list of policies with default params', () => {
      service.getAll().subscribe(res => {
        expect(res.data.length).toBe(2);
        expect(res.data).toEqual(mockPolicies);
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies?page=0&size=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should retrieve a paginated list of policies with custom params', () => {
      service.getAll(1, 5).subscribe(res => {
        expect(res.data.length).toBe(2);
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies?page=1&size=5`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should handle wrapped ApiResponse<PaginatedResponse> format', () => {
      const wrappedResponse = {
        success: true,
        message: 'Success',
        data: {
          data: mockPolicies,
          pageNumber: 0,
          pageSize: 10,
          totalElements: 2,
          totalPages: 1,
          isFirst: true,
          isLast: true
        }
      };

      service.getAll().subscribe(res => {
        expect(res.data).toEqual(mockPolicies);
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies?page=0&size=10`);
      req.flush(wrappedResponse);
    });

    it('should handle HTTP error appropriately', () => {
      service.getAll().subscribe({
        next: () => fail('Expected error'),
        error: (error) => expect(error.message).toBe('Server error')
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies?page=0&size=10`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should retrieve a single policy by id', () => {
      service.getById(1).subscribe(policy => {
        expect(policy).toEqual(mockPolicies[0]);
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('should throw error if response success is false', () => {
      service.getById(99).subscribe({
        next: () => fail('Expected error'),
        error: (error) => expect(error.message).toBe('Policy not found')
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies/99`);
      req.flush({ success: false, message: 'Policy not found', data: null });
    });

    it('should handle HTTP error completely', () => {
      service.getById(1).subscribe({
        next: () => fail('Expected error'),
        error: (error) => expect(error.message).toBe('Failed to load policy')
      });

      const req = httpMock.expectOne(`${environment.apiBase}/policies/1`);
      req.flush({ message: 'Failed to load policy' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
