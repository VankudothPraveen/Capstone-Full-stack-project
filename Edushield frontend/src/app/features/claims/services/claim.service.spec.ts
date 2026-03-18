import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClaimService } from './claim.service';
import { environment } from '../../../../environments/environment';
import { Claim } from '../../../core/models/interfaces';

describe('ClaimService', () => {
    let service: ClaimService;
    let httpMock: HttpTestingController;

    const mockClaim: Claim = {
        claimId: 1,
        claimType: 'MATURITY',
        claimAmount: 50000,
        status: 'SUBMITTED',
        claimDate: '2023-01-01',
        policySubscription: { subscriptionId: 1 } as any
    } as any;

    const mockApiResponse = {
        success: true,
        message: 'Success',
        data: mockClaim
    };

    const mockPaginatedResponse = {
        success: true,
        message: 'Success',
        data: {
            data: [mockClaim],
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
            providers: [ClaimService]
        });

        service = TestBed.inject(ClaimService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('fileClaim', () => {
        it('should file a claim', () => {
            const payload: Partial<Claim> = {
                subscriptionId: 1,
                claimType: 'MATURITY',
                claimAmount: 50000
            } as any;

            service.fileClaim(payload).subscribe(res => {
                expect(res).toEqual(mockClaim);
            });

            const req = httpMock.expectOne(`${environment.apiBase}/claims`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush(mockApiResponse);
        });

        it('should handle fileClaim error', () => {
            service.fileClaim({}).subscribe({
                error: (err) => expect(err.message).toBe('Server Error')
            });

            const req = httpMock.expectOne(`${environment.apiBase}/claims`);
            req.flush({ message: 'Server Error' }, { status: 500, statusText: 'Server Error' });
        });
    });

    describe('getMyClaims', () => {
        it('should retrieve claims and normalize rejectionReason', () => {
            const mockDataWithWeirdReasons = {
                success: true,
                data: {
                    data: [
                        { claimId: 1, rejection_reason: 'Reason A' },
                        { claimId: 2, reason: 'Reason B' },
                        { claimId: 3, rejectionReason: 'Reason C' }
                    ]
                }
            };

            service.getMyClaims(0, 10).subscribe(res => {
                expect(res.data[0].rejectionReason).toBe('Reason A');
                expect(res.data[1].rejectionReason).toBe('Reason B');
                expect(res.data[2].rejectionReason).toBe('Reason C');
            });

            const req = httpMock.expectOne(`${environment.apiBase}/claims/my?page=0&size=10`);
            expect(req.request.method).toBe('GET');
            req.flush(mockDataWithWeirdReasons);
        });
    });

    describe('getById', () => {
        it('should get claim by ID and normalize rejection reason', () => {
            service.getById(1).subscribe(res => {
                expect(res.claimId).toEqual(1);
                expect(res.rejectionReason).toBe('Test Reason');
            });

            const req = httpMock.expectOne(`${environment.apiBase}/claims/1`);
            expect(req.request.method).toBe('GET');
            req.flush({ success: true, data: { claimId: 1, rejection_reason: 'Test Reason' } });
        });

        it('should throw error on unsuccessful getById response', () => {
            service.getById(1).subscribe({
                error: (err) => expect(err.message).toBe('Claim not found')
            });

            const req = httpMock.expectOne(`${environment.apiBase}/claims/1`);
            req.flush({ success: false, message: 'Claim not found' });
        });
    });
});
