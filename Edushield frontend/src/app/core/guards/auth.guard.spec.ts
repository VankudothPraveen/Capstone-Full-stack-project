import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard, adminGuard, underwriterGuard, claimsOfficerGuard, guestGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('Guards', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin', 'isUnderwriter', 'isClaimsOfficer']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  describe('authGuard', () => {
    it('should allow access if authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      const res = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
      expect(res).toBeTrue();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should deny access and redirect to login if not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      const res = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
      expect(res).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    });
  });

  describe('adminGuard', () => {
    it('should allow access if authenticated and admin', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isAdmin.and.returnValue(true);
      const res = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));
      expect(res).toBeTrue();
    });

    it('should deny access and redirect to dashboard if not admin', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isAdmin.and.returnValue(false);
      const res = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));
      expect(res).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('underwriterGuard', () => {
    it('should allow access if authenticated and underwriter', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isUnderwriter.and.returnValue(true);
      const res = TestBed.runInInjectionContext(() => underwriterGuard(dummyRoute, dummyState));
      expect(res).toBeTrue();
    });

    it('should deny access and redirect to dashboard if not underwriter', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isUnderwriter.and.returnValue(false);
      const res = TestBed.runInInjectionContext(() => underwriterGuard(dummyRoute, dummyState));
      expect(res).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('claimsOfficerGuard', () => {
    it('should allow access if authenticated and claims officer', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isClaimsOfficer.and.returnValue(true);
      const res = TestBed.runInInjectionContext(() => claimsOfficerGuard(dummyRoute, dummyState));
      expect(res).toBeTrue();
    });

    it('should deny access and redirect if not claims officer', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      authServiceSpy.isClaimsOfficer.and.returnValue(false);
      const res = TestBed.runInInjectionContext(() => claimsOfficerGuard(dummyRoute, dummyState));
      expect(res).toBeFalse();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
    });
  });

  describe('guestGuard', () => {
    it('should allow access if not authenticated', () => {
      authServiceSpy.isAuthenticated.and.returnValue(false);
      const res = TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));
      expect(res).toBeTrue();
    });

    it('should redirect authenticated users to their respective dashboards', () => {
      authServiceSpy.isAuthenticated.and.returnValue(true);
      
      authServiceSpy.isAdmin.and.returnValue(true);
      TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);

      authServiceSpy.isAdmin.and.returnValue(false);
      authServiceSpy.isUnderwriter.and.returnValue(true);
      TestBed.runInInjectionContext(() => guestGuard(dummyRoute, dummyState));
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/underwriter/dashboard']);
    });
  });
});
