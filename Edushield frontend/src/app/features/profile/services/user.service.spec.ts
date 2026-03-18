import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../../environments/environment';
import { User } from '../../../core/models/interfaces';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const mockUser: User = {
    userId: 1,
    name: 'Test User',
    email: 'test@example.com',
    phone: '1234567890'
  } as User;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get profile', () => {
    service.getProfile().subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiBase}/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockUser });
  });

  it('should update profile', () => {
    service.updateProfile(mockUser).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${environment.apiBase}/users/me`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: mockUser });
  });

  it('should handle error when getting profile', () => {
    const errorMsg = 'Profile not found';
    service.getProfile().subscribe({
      error: err => expect(err.message).toBe(errorMsg)
    });

    const req = httpMock.expectOne(`${environment.apiBase}/users/me`);
    req.flush({ success: false, message: errorMsg }, { status: 404, statusText: 'Not Found' });
  });
});
