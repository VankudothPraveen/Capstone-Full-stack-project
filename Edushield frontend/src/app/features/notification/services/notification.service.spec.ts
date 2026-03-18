import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NotificationService, Notification } from './notification.service';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../../environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

describe('NotificationService', () => {
  let service: NotificationService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const apiUrl = `${environment.apiBase}/notifications`;

  const mockNotifications: Notification[] = [
    { id: 1, userId: 1, recipientRole: 'USER', title: 'Application Approved', message: 'Your application was approved', type: 'APP', isRead: false, createdAt: '2025-01-01', targetUrl: '/dashboard' },
    { id: 2, userId: 1, recipientRole: 'USER', title: 'Payment Due', message: 'Premium due', type: 'PAYMENT', isRead: true, createdAt: '2025-01-02', targetUrl: '/payments' }
  ];

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser', 'isAdmin', 'isUnderwriter', 'isClaimsOfficer', 'isAuthenticated']);
    authServiceSpy.currentUser.and.returnValue({ userId: 1, role: 'USER' } as any);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        NotificationService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: SocialAuthService, useValue: { authState: { subscribe: () => {} } } },
      ],
    });
    service = TestBed.inject(NotificationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadNotifications', () => {
    it('should GET notifications and update signals', () => {
      service.loadNotifications();

      const req = httpMock.expectOne(r => r.url === apiUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('userId')).toBe('1');
      expect(req.request.params.get('role')).toBe('USER');
      req.flush(mockNotifications);

      expect(service.notifications()).toEqual(mockNotifications);
      expect(service.unreadCount()).toBe(1); // only 1 unread
    });

    it('should not make HTTP call if user is null', () => {
      authServiceSpy.currentUser.and.returnValue(null);
      service.loadNotifications();
      httpMock.expectNone(apiUrl);
    });
  });

  describe('markAsRead', () => {
    it('should PUT to mark a notification as read and update signal', () => {
      service.notifications.set(mockNotifications);
      service.unreadCount.set(1);

      service.markAsRead(1);

      const req = httpMock.expectOne(`${apiUrl}/1/read`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(service.notifications().find(n => n.id === 1)?.isRead).toBeTrue();
      expect(service.unreadCount()).toBe(0);
    });
  });

  describe('markAllAsRead', () => {
    it('should PUT read-all and set all notifications as read', () => {
      service.notifications.set(mockNotifications);
      service.unreadCount.set(1);

      service.markAllAsRead();

      const req = httpMock.expectOne(r => r.url === `${apiUrl}/read-all`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(service.notifications().every(n => n.isRead)).toBeTrue();
      expect(service.unreadCount()).toBe(0);
    });

    it('should not make HTTP call if user is null', () => {
      authServiceSpy.currentUser.and.returnValue(null);
      service.markAllAsRead();
      httpMock.expectNone(`${apiUrl}/read-all`);
    });
  });
});
