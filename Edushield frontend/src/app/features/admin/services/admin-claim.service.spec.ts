import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminClaimService } from './admin-claim.service';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { Claim } from '../../../core/models/interfaces';
import { SocialAuthService } from '@abacritt/angularx-social-login';

describe('AdminClaimService', () => {
  let service: AdminClaimService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const adminBase = `${environment.apiBase}/admin/claims`;
  const officerBase = `${environment.apiBase}/claims-officer/claims`;

  const mockClaim: Claim = {
    claimId: 1, status: 'SUBMITTED', claimType: 'MATURITY', claimAmount: 50000
  } as any;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isClaimsOfficer', 'isUnderwriter', 'isAdmin', 'currentUser', 'isAuthenticated']);
    authServiceSpy.isClaimsOfficer.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AdminClaimService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SocialAuthService, useValue: { authState: { subscribe: () => {} } } },
      ],
    });
    service = TestBed.inject(AdminClaimService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should use admin base URL when not claims officer', () => {
      service.getAll().subscribe(claims => {
        expect(claims[0]).toEqual(jasmine.objectContaining({ claimId: 1 }));
      });
      const req = httpMock.expectOne(`${adminBase}?page=0&size=10`);
      req.flush({ data: [mockClaim] });
    });

    it('should use claims officer URL when isClaimsOfficer returns true', () => {
      authServiceSpy.isClaimsOfficer.and.returnValue(true);
      service.getAll().subscribe();
      const req = httpMock.expectOne(`${officerBase}?page=0&size=10`);
      req.flush([]);
    });

    it('should normalize rejection_reason field', () => {
      service.getAll().subscribe(claims => {
        expect(claims[0].rejectionReason).toBe('Bad input');
      });
      const req = httpMock.expectOne(`${adminBase}?page=0&size=10`);
      req.flush({ data: [{ ...mockClaim, rejection_reason: 'Bad input' }] });
    });
  });

  describe('approve', () => {
    it('should PUT approve a claim', () => {
      service.approve(1).subscribe(res => expect(res).toEqual(mockClaim));
      const req = httpMock.expectOne(`${adminBase}/1/approve`);
      expect(req.request.method).toBe('PUT');
      req.flush({ success: true, data: mockClaim });
    });

    it('should include revisedAmount when provided', () => {
      service.approve(1, 45000).subscribe();
      const req = httpMock.expectOne(`${adminBase}/1/approve?revisedAmount=45000`);
      req.flush({ success: true, data: mockClaim });
    });
  });

  describe('reject', () => {
    it('should PUT reject a claim with reason params and body', () => {
      service.reject(1, 'Invalid documents').subscribe(res => expect(res).toEqual(mockClaim));
      const req = httpMock.expectOne(r => r.url === `${adminBase}/1/reject`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.params.get('rejectionReason')).toBe('Invalid documents');
      expect(req.request.body).toEqual({ rejectionReason: 'Invalid documents', reason: 'Invalid documents' });
      req.flush({ success: true, data: mockClaim });
    });
  });
});
