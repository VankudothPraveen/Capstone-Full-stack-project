import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminApplicationService } from './admin-application.service';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { PolicyApplication } from '../../../core/models/interfaces';
import { SocialAuthService } from '@abacritt/angularx-social-login';

describe('AdminApplicationService', () => {
  let service: AdminApplicationService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const adminBase = `${environment.apiBase}/admin/policy-applications`;
  const underwriterBase = `${environment.apiBase}/underwriter/applications`;

  const mockApp: PolicyApplication = {
    applicationId: 1, status: 'PENDING', calculatedPremium: 1200
  } as any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isUnderwriter', 'isAdmin', 'isClaimsOfficer', 'currentUser', 'isAuthenticated']);
    authServiceSpy.isUnderwriter.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminApplicationService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SocialAuthService, useValue: { authState: { subscribe: () => {} } } },
      ],
    });
    service = TestBed.inject(AdminApplicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll (admin role)', () => {
    it('should call admin base URL when not underwriter', () => {
      service.getAll(0, 10).subscribe(res => {
        expect(res.data[0]).toEqual(mockApp);
      });
      const req = httpMock.expectOne(`${adminBase}?page=0&size=10`);
      req.flush({ success: true, data: { data: [mockApp], pageNumber: 0, pageSize: 10, totalElements: 1, totalPages: 1 } });
    });

    it('should call underwriter base URL when user is underwriter', () => {
      authServiceSpy.isUnderwriter.and.returnValue(true);
      service.getAll(0, 5).subscribe();
      const req = httpMock.expectOne(`${underwriterBase}?page=0&size=5`);
      req.flush({ success: true, data: { data: [], pageNumber: 0, pageSize: 5, totalElements: 0, totalPages: 0 } });
    });
  });

  describe('getById', () => {
    it('should fetch application by ID from admin endpoint', () => {
      service.getById(1).subscribe(res => expect(res).toEqual(mockApp));
      const req = httpMock.expectOne(`${adminBase}/1`);
      req.flush({ success: true, data: mockApp });
    });
  });

  describe('approve', () => {
    it('should PUT approve without revisedPremium', () => {
      service.approve(1).subscribe(res => expect(res).toEqual(mockApp));
      const req = httpMock.expectOne(`${adminBase}/1/approve`);
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true, data: mockApp });
    });

    it('should include revisedPremium as query param when provided', () => {
      service.approve(1, 1500).subscribe();
      const req = httpMock.expectOne(`${adminBase}/1/approve?revisedPremium=1500`);
      req.flush({ success: true, data: mockApp });
    });
  });

  describe('reject', () => {
    it('should PUT reject with rejection reason', () => {
      service.reject(1, 'Insufficient income').subscribe(res => expect(res).toEqual(mockApp));
      const req = httpMock.expectOne(r => r.url === `${adminBase}/1/reject`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.params.get('rejectionReason')).toBe('Insufficient income');
      req.flush({ success: true, data: mockApp });
    });
  });

  describe('updateStatus', () => {
    it('should PUT update status', () => {
      service.updateStatus(1, 'APPROVED').subscribe(res => expect(res).toEqual(mockApp));
      const req = httpMock.expectOne(`${adminBase}/1/status`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: 'APPROVED' });
      req.flush({ success: true, data: mockApp });
    });
  });
});
