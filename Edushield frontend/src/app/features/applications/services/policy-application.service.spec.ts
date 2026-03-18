import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyApplicationService } from './policy-application.service';
import { environment } from '../../../../environments/environment';
import { PolicyApplication } from '../../../core/models/interfaces';

describe('PolicyApplicationService', () => {
    let service: PolicyApplicationService;
    let httpMock: HttpTestingController;

    const mockApplication: PolicyApplication = {
        applicationId: 1,
        status: 'PENDING',
        calculatedPremium: 1000,
        riskScore: 10,
        riskCategory: 'LOW',
        startDate: '2023-01-01',
        endDate: '2033-01-01',
        policy: { policyName: 'Test Policy' } as any,
        child: { childName: 'Test Child' } as any
    } as any;

    const mockApiResponse = {
        success: true,
        message: 'Success',
        data: mockApplication
    };

    const mockPaginatedResponse = {
        success: true,
        message: 'Success',
        data: {
            data: [mockApplication],
            pageNumber: 0,
            pageSize: 10,
            totalElements: 1,
            totalPages: 1,
            isFirst: true,
            isLast: true
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [PolicyApplicationService]
        });

        service = TestBed.inject(PolicyApplicationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('create', () => {
        it('should create an application successfully', () => {
            const payload: Partial<PolicyApplication> = {
                policyId: 1,
                childId: 1,
                annualIncome: 50000
            } as any;

            service.create(payload).subscribe(res => {
                expect(res).toEqual(mockApplication);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockApiResponse);
        });

        it('should handle creation error', () => {
            service.create({}).subscribe({
                error: err => expect(err.message).toBe('Bad Request')
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications`);
            req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('getMyApplications', () => {
        it('should retrieve my applications paginated (wrapped format)', () => {
            service.getMyApplications(1, 5).subscribe(res => {
                expect(res.data.length).toBe(1);
                expect(res.data[0]).toEqual(mockApplication);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/my?page=1&size=5`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPaginatedResponse);
        });

        it('should retrieve my applications paginated (direct format)', () => {
            service.getMyApplications().subscribe(res => {
                expect(res.data.length).toBe(1);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/my?page=0&size=10`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPaginatedResponse.data); // sending direct format without wrapper
        });
    });

    describe('getById', () => {
        it('should get an application by ID', () => {
            service.getById(1).subscribe(res => {
                expect(res).toEqual(mockApplication);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/1`);
            expect(req.request.method).toBe('GET');
            req.flush(mockApiResponse);
        });
        
        it('should handle inner success false error', () => {
             service.getById(1).subscribe({
                 error: err => expect(err.message).toBe('Policy App not found')
             });

             const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/1`);
             expect(req.request.method).toBe('GET');
             req.flush({ success: false, message: 'Policy App not found', data: null });
        });
    });

    describe('cancel', () => {
        it('should cancel an application', () => {
            service.cancel(1).subscribe(res => {
                expect(res).toEqual(mockApplication);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/1/cancel`);
            expect(req.request.method).toBe('PUT');
            req.flush(mockApiResponse);
        });
    });

    describe('downloadCertificate', () => {
        it('should request certificate blob', () => {
            const dummyBlob = new Blob(['pdf-content'], { type: 'application/pdf' });

            service.downloadCertificate(1).subscribe(blob => {
                expect(blob).toEqual(dummyBlob);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/policy-applications/1/certificate`);
            expect(req.request.method).toBe('GET');
            expect(req.request.responseType).toBe('blob');
            req.flush(dummyBlob);
        });
    });
});
