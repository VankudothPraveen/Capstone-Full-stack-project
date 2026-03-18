import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { of, throwError } from 'rxjs';

import { ActivatedRoute } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with invalid state', () => {
    expect(component.registerForm.invalid).toBeTrue();
    expect(component.registerForm.get('name')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
  });

  it('should invalidate short name', () => {
    const nameCtrl = component.registerForm.get('name');
    nameCtrl?.setValue('ab');
    expect(nameCtrl?.invalid).toBeTrue();
    nameCtrl?.setValue('abc');
    expect(nameCtrl?.valid).toBeTrue();
  });

  it('should validate phone numbers matching pattern (start 6-9, 10 digits)', () => {
    const phoneCtrl = component.registerForm.get('phone');
    phoneCtrl?.setValue('1234567890');
    expect(phoneCtrl?.invalid).toBeTrue();
    
    phoneCtrl?.setValue('9876543210');
    expect(phoneCtrl?.valid).toBeTrue();
  });

  it('should properly validate password strength', () => {
    const pwdCtrl = component.passwords.get('password');
    pwdCtrl?.setValue('weak');
    expect(pwdCtrl?.invalid).toBeTrue();
    
    pwdCtrl?.setValue('Strong1@');
    expect(pwdCtrl?.valid).toBeTrue();
  });

  it('should invalidate if passwords do not match', () => {
    component.passwords.patchValue({
      password: 'StrongPassword1@',
      confirmPassword: 'MismatchPassword1@'
    });
    
    // Check custom cross-field validation
    expect(component.passwords.hasError('mismatch')).toBeTrue();
  });

  it('should calculate strength score based on characters', () => {
    const pwdCtrl = component.passwords.get('password');
    
    pwdCtrl?.setValue('a');
    expect(component.getStrengthScore()).toBe(0); // Only length
    
    pwdCtrl?.setValue('A1@aaaaa');
    expect(component.getStrengthScore()).toBe(4); // Length(8+), Upper, Number, Special
  });

  it('should return correct strength colors based on index and score', () => {
    const pwdCtrl = component.passwords.get('password');
    pwdCtrl?.setValue('a'); // Score 0
    expect(component.getStrengthColor(1)).toBe('bg-gray-200'); // Index > score
    
    pwdCtrl?.setValue('A1@aaaaa'); // Score 4
    expect(component.getStrengthColor(1)).toBe('bg-emerald-500'); 
  });

  it('should return correct strength labels', () => {
    const pwdCtrl = component.passwords.get('password');
    pwdCtrl?.setValue('a');
    expect(component.getStrengthLabel()).toBe('Weak');
    
    pwdCtrl?.setValue('A1@aaaaa');
    expect(component.getStrengthLabel()).toBe('Strong');
  });

  it('should submit valid form and handle success', () => {
    authServiceSpy.register.and.returnValue(of({} as any));

    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
    });
    component.passwords.patchValue({
      password: 'StrongPassword1@',
      confirmPassword: 'StrongPassword1@'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
      password: 'StrongPassword1@'
    });
    expect(toastSpy.success).toHaveBeenCalledWith('Account created! Please sign in.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
    expect(component.loading()).toBeFalse();
  });

  it('should handle submission error', () => {
    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));

    // Set valid form
    component.registerForm.patchValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210',
    });
    component.passwords.patchValue({
      password: 'StrongPassword1@',
      confirmPassword: 'StrongPassword1@'
    });

    component.onSubmit();

    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(component.errorMsg()).toBe('Registration failed');
    expect(component.loading()).toBeFalse();
  });

  it('should mark all fields as touched if submitting invalid form', () => {
    component.onSubmit();
    expect(component.registerForm.touched).toBeTrue();
    expect(authServiceSpy.register).not.toHaveBeenCalled();
  });
});
