import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { of } from 'rxjs';

describe('authInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should add an Authorization header when an authToken is present in localStorage', (done) => {
    localStorage.setItem('authToken', 'fake-token-123');
    
    const request = new HttpRequest('GET', '/api/data');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBeTrue();
      expect(req.headers.get('Authorization')).toEqual('Bearer fake-token-123');
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe(() => done());
    });
  });

  it('should not add an Authorization header when authToken is absent', (done) => {
    localStorage.removeItem('authToken');
    
    const request = new HttpRequest('GET', '/api/data');
    const next: HttpHandlerFn = (req) => {
      expect(req.headers.has('Authorization')).toBeFalse();
      return of(new HttpResponse({ status: 200 }));
    };

    TestBed.runInInjectionContext(() => {
      authInterceptor(request, next).subscribe(() => done());
    });
  });
});
