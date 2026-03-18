import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminUserService, CreateStaffRequest } from './admin-user.service';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/interfaces';

describe('AdminUserService', () => {
  let service: AdminUserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    userId: 1, name: 'Test User', email: 'test@test.com', role: 'UNDERWRITER', isActive: true, phone: '9876543210'
  } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminUserService],
    });
    service = TestBed.inject(AdminUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsers', () => {
    it('should return array directly if response is a plain array', () => {
      service.getAllUsers().subscribe(users => {
        expect(users).toEqual([mockUser]);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/users?page=0&size=100`);
      req.flush([mockUser]);
    });

    it('should extract res.data when it is an array', () => {
      service.getAllUsers().subscribe(users => {
        expect(users.length).toBe(1);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/users?page=0&size=100`);
      req.flush({ data: [mockUser] });
    });

    it('should extract res.content when present', () => {
      service.getAllUsers().subscribe(users => {
        expect(users[0]).toEqual(mockUser);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/users?page=0&size=100`);
      req.flush({ content: [mockUser] });
    });

    it('should return empty array for unrecognised format', () => {
      service.getAllUsers().subscribe(users => {
        expect(users).toEqual([]);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/users?page=0&size=100`);
      req.flush({});
    });
  });

  describe('createStaff', () => {
    it('should POST to create-staff endpoint', () => {
      const payload: CreateStaffRequest = { name: 'Staff', email: 's@s.com', password: 'pass', role: 'UNDERWRITER' };
      service.createStaff(payload).subscribe(res => {
        expect(res).toEqual(mockUser);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/admin/users/create-staff`);
      expect(req.request.method).toBe('POST');
      req.flush({ success: true, data: mockUser });
    });

    it('should handle creation failure', () => {
      service.createStaff({ name: '', email: '', password: '', role: 'UNDERWRITER' }).subscribe({
        error: (err) => expect(err.message).toBe('Email already exists')
      });
      const req = httpMock.expectOne(`${environment.apiBase}/admin/users/create-staff`);
      req.flush({ message: 'Email already exists' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('updateUserStatus', () => {
    it('should PATCH status for a given userId', () => {
      service.updateUserStatus(1, true).subscribe(res => {
        expect(res).toEqual(mockUser);
      });
      const req = httpMock.expectOne(`${environment.apiBase}/admin/users/1/status`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ active: true });
      req.flush({ success: true, data: mockUser });
    });
  });

  describe('deleteUser', () => {
    it('should DELETE a user and return true', () => {
      service.deleteUser(1).subscribe(res => {
        expect(res).toBeTrue();
      });
      const req = httpMock.expectOne(`${environment.apiBase}/users/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush('OK');
    });
  });
});
