import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAuditService } from './admin-audit.service';
import { environment } from '../../../../environments/environment';

describe('AdminAuditService', () => {
  let service: AdminAuditService;
  let httpMock: HttpTestingController;

  const auditBase = `${environment.apiBase}/admin/audit-logs`;
  const exportBase = `${environment.apiBase}/admin/export`;

  const mockLogs = { data: [{ logId: 1, action: 'LOGIN', email: 'user@test.com' }] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminAuditService],
    });
    service = TestBed.inject(AdminAuditService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAuditLogs', () => {
    it('should fetch logs with default pagination', () => {
      service.getAuditLogs().subscribe(res => {
        expect(res[0].action).toBe('LOGIN');
      });
      const req = httpMock.expectOne(`${auditBase}?page=0&size=20`);
      expect(req.request.method).toBe('GET');
      req.flush({ success: true, data: mockLogs.data });
    });

    it('should include optional filter params', () => {
      service.getAuditLogs(0, 20, { action: 'LOGIN', email: 'user@test.com', startDate: '2025-01-01', endDate: '2025-12-31' }).subscribe();
      const req = httpMock.expectOne(r =>
        r.url === auditBase &&
        r.params.get('action') === 'LOGIN' &&
        r.params.get('email') === 'user@test.com'
      );
      req.flush({ success: true, data: mockLogs.data });
    });
  });

  describe('getLogsByUser', () => {
    it('should fetch audit logs for specific userId', () => {
      service.getLogsByUser(1, 0, 20).subscribe(res => {
        expect(res).toBeTruthy();
      });
      const req = httpMock.expectOne(`${auditBase}/user/1?page=0&size=20`);
      req.flush({ success: true, data: mockLogs.data });
    });
  });

  describe('getLogsByAction', () => {
    it('should fetch logs filtered by action', () => {
      service.getLogsByAction('LOGIN', 0, 10).subscribe();
      const req = httpMock.expectOne(`${auditBase}/action/LOGIN?page=0&size=10`);
      req.flush({ success: true, data: mockLogs.data });
    });
  });

  describe('getDistinctActions', () => {
    it('should return list of distinct action strings', () => {
      service.getDistinctActions().subscribe(actions => {
        expect(actions).toContain('LOGIN');
      });
      const req = httpMock.expectOne(`${auditBase}/actions`);
      req.flush({ success: true, data: ['LOGIN', 'LOGOUT', 'CREATE_APPLICATION'] });
    });
  });

  describe('Export methods', () => {
    const exportEndpoints = ['users', 'policies', 'applications', 'claims', 'audit-logs'];
    const exportMethods: { [key: string]: () => any } = {
      users: () => service.exportUsers(),
      policies: () => service.exportPolicies(),
      applications: () => service.exportApplications(),
      claims: () => service.exportClaims(),
      'audit-logs': () => service.exportAuditLogs(),
    };

    exportEndpoints.forEach(endpoint => {
      it(`should GET ${endpoint} as blob`, () => {
        exportMethods[endpoint]().subscribe((blob: Blob) => {
          expect(blob).toBeTruthy();
        });
        const req = httpMock.expectOne(`${exportBase}/${endpoint}`);
        expect(req.request.method).toBe('GET');
        expect(req.request.responseType).toBe('blob');
        req.flush(new Blob(['data'], { type: 'application/vnd.ms-excel' }));
      });
    });
  });
});
