import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StaffManagementComponent } from './staff-management.component';
import { AdminUserService, CreateStaffRequest } from '../../services/admin-user.service';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { of, throwError } from 'rxjs';
import { User } from '../../../../core/models/interfaces';
import { FormsModule } from '@angular/forms';

describe('StaffManagementComponent', () => {
  let component: StaffManagementComponent;
  let fixture: ComponentFixture<StaffManagementComponent>;
  let adminUserServiceSpy: jasmine.SpyObj<AdminUserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastSpy: jasmine.SpyObj<ToastService>;

  const mockUsers: User[] = [
    { userId: 1, name: 'Admin', role: 'ROLE_ADMIN', isActive: true } as User,
    { userId: 2, name: 'Underwriter', role: 'ROLE_UNDERWRITER', isActive: true } as User,
    { userId: 3, name: 'Claims Officer', role: 'CLAIMS_OFFICER', isActive: false } as User,
    { userId: 4, name: 'User', role: 'USER', isActive: true } as User,
  ];

  beforeEach(async () => {
    adminUserServiceSpy = jasmine.createSpyObj('AdminUserService', ['getAllUsers', 'createStaff', 'updateUserStatus']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
    toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);

    authServiceSpy.currentUser.and.returnValue({ userId: 1 } as any);
    adminUserServiceSpy.getAllUsers.and.returnValue(of(mockUsers));

    await TestBed.configureTestingModule({
      imports: [StaffManagementComponent, FormsModule],
      providers: [
        { provide: AdminUserService, useValue: adminUserServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StaffManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load staff users (filtering out ADMIN and USER) on init', () => {
    fixture.detectChanges();
    expect(adminUserServiceSpy.getAllUsers).toHaveBeenCalledWith(0, 500);
    expect(component.users().length).toBe(2);
    expect(component.users()[0].name).toBe('Underwriter');
    expect(component.users()[1].name).toBe('Claims Officer');
  });

  it('should show error toast if loadUsers fails', () => {
    adminUserServiceSpy.getAllUsers.and.returnValue(throwError(() => new Error('Failed to load users')));
    fixture.detectChanges();
    expect(toastSpy.error).toHaveBeenCalledWith('Failed to load users');
  });

  it('should open create modal with correct role and empty fields', () => {
    fixture.detectChanges();
    component.openCreateModal('CLAIMS_OFFICER');
    expect(component.newStaff.role).toBe('CLAIMS_OFFICER');
    expect(component.newStaff.name).toBe('');
    expect(component.showCreateModal()).toBeTrue();
  });

  it('should show error if createStaff is called with empty fields', () => {
    fixture.detectChanges();
    component.newStaff = { name: '', email: '', password: '', role: 'UNDERWRITER' };
    component.createStaff();
    expect(toastSpy.error).toHaveBeenCalledWith('All fields are required');
    expect(adminUserServiceSpy.createStaff).not.toHaveBeenCalled();
  });

  it('should call createStaff, show success toast, and reload users on successful creation', () => {
    fixture.detectChanges();
    adminUserServiceSpy.createStaff.and.returnValue(of({} as any));
    
    component.newStaff = { name: 'Test Staff', email: 'staff@test.com', password: 'pass', role: 'UNDERWRITER' };
    component.createStaff();
    
    expect(adminUserServiceSpy.createStaff).toHaveBeenCalledWith(component.newStaff);
    expect(toastSpy.success).toHaveBeenCalledWith('UNDERWRITER account created successfully!');
    expect(component.showCreateModal()).toBeFalse();
    // loadUsers is called twice: once on init, once on successful creation
    expect(adminUserServiceSpy.getAllUsers).toHaveBeenCalledTimes(2);
  });

  it('should show error toast if createStaff fails', () => {
    fixture.detectChanges();
    adminUserServiceSpy.createStaff.and.returnValue(throwError(() => new Error('Creation failed')));
    
    component.newStaff = { name: 'Test', email: 'test@t.com', password: 'pass', role: 'UNDERWRITER' };
    component.createStaff();
    
    expect(toastSpy.error).toHaveBeenCalledWith('Creation failed');
    expect(component.creating()).toBeFalse();
  });

  it('should call updateUserStatus with inverted status and reload users', () => {
    fixture.detectChanges();
    adminUserServiceSpy.updateUserStatus.and.returnValue(of({} as any));
    
    const user = { userId: 2, isActive: true } as User;
    component.toggleStatus(user);
    
    expect(adminUserServiceSpy.updateUserStatus).toHaveBeenCalledWith(2, false);
    expect(toastSpy.success).toHaveBeenCalledWith('User deactivated successfully');
    expect(adminUserServiceSpy.getAllUsers).toHaveBeenCalledTimes(2);
  });

  it('should show error toast if updateUserStatus fails', () => {
    fixture.detectChanges();
    adminUserServiceSpy.updateUserStatus.and.returnValue(throwError(() => new Error('Update failed')));
    
    const user = { userId: 2, isActive: true } as User;
    component.toggleStatus(user);
    
    expect(toastSpy.error).toHaveBeenCalledWith('Update failed');
  });

});
