import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastService>;
  let authStateSubject: BehaviorSubject<any>;
  let socialAuthServiceMock: any;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'loginWithGoogle']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
    
    authStateSubject = new BehaviorSubject<any>(null);
    socialAuthServiceMock = {
      authState: authStateSubject.asObservable(),
      initializationState: of(true),
      initializationError: of(null),
      signIn: jasmine.createSpy('signIn'),
      signOut: jasmine.createSpy('signOut'),
      refreshAuthToken: jasmine.createSpy('refreshAuthToken'),
      refreshUser: jasmine.createSpy('refreshUser'),
      providers: new Map()
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: SocialAuthService, useValue: socialAuthServiceMock },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
    .overrideComponent(LoginComponent, {
      remove: { imports: [GoogleSigninButtonModule] },
      add: { schemas: [NO_ERRORS_SCHEMA] }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty fields and validators', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.invalid).toBeTrue();
  });

  it('should show validation errors if form is submitted empty', () => {
    component.onSubmit();
    expect(component.loginForm.touched).toBeTrue();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login when form is valid and submitted', () => {
    const mockRes = { user: { name: 'Test', role: 'USER' } };
    authServiceSpy.login.and.returnValue(of(mockRes as any));

    component.loginForm.patchValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@test.com', password: 'password123' });
    expect(toastSpy.success).toHaveBeenCalledWith('Welcome back, Test!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle login error correctly', () => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    component.loginForm.patchValue({ email: 'test@test.com', password: 'wrong' });
    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(component.errorMsg()).toBe('Invalid credentials');
    expect(component.loading()).toBeFalse();
  });

  it('should automatically login with google when authState emits valid user', () => {
    const mockRes = { user: { name: 'Google User', role: 'USER' } };
    authServiceSpy.loginWithGoogle.and.returnValue(of(mockRes as any));

    authStateSubject.next({ idToken: 'fake-google-token' });

    expect(authServiceSpy.loginWithGoogle).toHaveBeenCalledWith('fake-google-token');
    expect(toastSpy.success).toHaveBeenCalledWith('Welcome, Google User!');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to admin dashboard for ADMIN role', () => {
    component.handleNavigation({ role: 'ADMIN' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);

    component.handleNavigation({ roleName: 'ROLE_ADMIN' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/dashboard']);
  });

  it('should navigate to underwriter dashboard for UNDERWRITER role', () => {
    component.handleNavigation({ role: 'UNDERWRITER' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/underwriter/dashboard']);
  });

  it('should navigate to claims dashboard for CLAIMS_OFFICER role', () => {
    component.handleNavigation({ roleName: 'ROLE_CLAIMS_OFFICER' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/claims/dashboard']);
  });
});
