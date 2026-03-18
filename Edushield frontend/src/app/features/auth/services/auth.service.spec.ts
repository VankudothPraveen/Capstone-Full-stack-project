import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/interfaces';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockSocialAuthService: jasmine.SpyObj<SocialAuthService>;

  const mockUser = {
    userId: 1,
    name: 'Test',
    email: 'test@test.com',
    role: 'USER',
    provider: 'LOCAL',
    phone: '1234567890'
  } as User;

  const mockAuthResponse = { token: 'mock-token', user: mockUser };
  const mockApiResponse = { success: true, message: 'Success', data: mockAuthResponse };

  beforeEach(() => {
    mockSocialAuthService = jasmine.createSpyObj('SocialAuthService', ['signOut']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: SocialAuthService, useValue: mockSocialAuthService }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should authenticate user, store token and user in localStorage, and update signal', () => {
      service.login({ email: 'test@test.com', password: 'password' }).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorage.getItem('authToken')).toBe('mock-token');
        expect(JSON.parse(localStorage.getItem('currentUser')!)).toEqual(mockUser);
        expect(service.currentUser()?.email).toBe('test@test.com');
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockApiResponse);
    });

    it('should handle login error correctly', () => {
      service.login({ email: 'test@test.com', password: 'wrong' }).subscribe({
        next: () => fail('expected an error'),
        error: (err) => expect(err.message).toBe('Invalid credentials')
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/login`);
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('loginWithGoogle', () => {
    it('should authenticate with google token and store data', () => {
      service.loginWithGoogle('google-token').subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
        expect(localStorage.getItem('authToken')).toBe('mock-token');
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/google`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ token: 'google-token' });
      req.flush(mockApiResponse);
    });
  });

  describe('register', () => {
    it('should register user and store data', () => {
      service.register({ name: 'Test', email: 'test@test.com', password: 'pass', phone: '1234567890' }).subscribe(user => {
        expect(user).toEqual(mockUser as any);
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/register`);
      expect(req.request.method).toBe('POST');
      req.flush(mockApiResponse);
    });
  });

  describe('logout', () => {
    it('should clear localStorage and update signal', async () => {
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      
      // We manually set sign out resolved
      mockSocialAuthService.signOut.and.resolveTo();

      await service.logout();
      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('currentUser')).toBeNull();
      expect(service.currentUser()).toBeNull();
    });
  });

  describe('role checks', () => {
    it('should correctly identify admin', () => {
      localStorage.setItem('currentUser', JSON.stringify({ role: 'ROLE_ADMIN' }));
      // We need to re-initialize since signal initializes on construction
      const svc = new AuthService({} as any, mockSocialAuthService);
      expect(svc.isAdmin()).toBeTrue();
      expect(svc.isUnderwriter()).toBeFalse();
    });

    it('should correctly identify underwriter', () => {
      localStorage.setItem('currentUser', JSON.stringify({ role: 'UNDERWRITER' }));
      const svc = new AuthService({} as any, mockSocialAuthService);
      expect(svc.isUnderwriter()).toBeTrue();
      expect(svc.isClaimsOfficer()).toBeFalse();
    });
  });

  describe('forgotPassword', () => {
    it('should send password reset link', () => {
      service.forgotPassword('test@test.com').subscribe(res => {
        expect(res.message).toBe('Password reset link sent to your email');
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/forgot-password`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Password reset link sent to your email' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', () => {
      service.resetPassword({ email: 'test@test.com', token: '123456', newPassword: 'new' }).subscribe(res => {
        expect(res.message).toBe('Password reset successfully');
      });

      const req = httpMock.expectOne(`${environment.apiBase}/auth/reset-password`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, message: 'Password reset successfully' });
    });
  });
});
