import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminPolicyService } from './admin-policy.service';
import { environment } from '../../../../environments/environment';
import { Policy } from '../../../core/models/interfaces';

describe('AdminPolicyService', () => {
  let service: AdminPolicyService;
  let httpMock: HttpTestingController;

  const base = `${environment.apiBase}/admin/policies`;
  const mockPolicy: Policy = {
    policyId: 1, policyName: 'Gold Plan', basePremium: 2000, durationYears: 15, isActive: true
  } as Policy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminPolicyService],
    });
    service = TestBed.inject(AdminPolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('create', () => {
    it('should POST a new policy', () => {
      const payload: Partial<Policy> = { policyName: 'Gold Plan' };
      service.create(payload).subscribe(res => expect(res).toEqual(mockPolicy));
      const req = httpMock.expectOne(base);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, data: mockPolicy });
    });

    it('should format fieldErrors into readable message', () => {
      service.create({}).subscribe({
        error: (err) => expect(err.message).toBe('policyName: must not be blank')
      });
      const req = httpMock.expectOne(base);
      req.flush({
        fieldErrors: [{ field: 'policyName', message: 'must not be blank' }]
      }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAll', () => {
    it('should get paginated policies', () => {
      service.getAll(0, 5).subscribe(res => expect(res.data[0]).toEqual(mockPolicy));
      const req = httpMock.expectOne(`${base}?page=0&size=5`);
      req.flush({ success: true, data: { data: [mockPolicy], pageNumber: 0, pageSize: 5, totalElements: 1, totalPages: 1 } });
    });
  });

  describe('getById', () => {
    it('should get policy by ID', () => {
      service.getById(1).subscribe(res => expect(res).toEqual(mockPolicy));
      const req = httpMock.expectOne(`${base}/1`);
      req.flush({ success: true, data: mockPolicy });
    });
  });

  describe('update', () => {
    it('should PUT updated policy data', () => {
      service.update(1, { policyName: 'Platinum' }).subscribe(res => expect(res.policyId).toBe(1));
      const req = httpMock.expectOne(`${base}/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true, data: mockPolicy });
    });
  });

  describe('delete', () => {
    it('should DELETE a policy', () => {
      service.delete(1).subscribe();
      const req = httpMock.expectOne(`${base}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ success: true, data: null });
    });
  });

  describe('activate / deactivate', () => {
    it('should PUT to activate endpoint', () => {
      service.activate(1).subscribe(res => expect(res).toEqual(mockPolicy));
      const req = httpMock.expectOne(`${base}/1/activate`);
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true, data: mockPolicy });
    });

    it('should PUT to deactivate endpoint', () => {
      service.deactivate(1).subscribe(res => expect(res).toEqual(mockPolicy));
      const req = httpMock.expectOne(`${base}/1/deactivate`);
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true, data: mockPolicy });
    });
  });
});
