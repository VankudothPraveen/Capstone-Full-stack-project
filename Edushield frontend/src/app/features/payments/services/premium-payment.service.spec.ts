import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PremiumPaymentService } from './premium-payment.service';
import { environment } from '../../../../environments/environment';
import { PremiumPayment } from '../../../core/models/interfaces';

describe('PremiumPaymentService', () => {
    let service: PremiumPaymentService;
    let httpTestingController: HttpTestingController;

    const mockPayment: PremiumPayment = {
        paymentId: 1,
        amount: 500,
        paymentDate: '2023-01-01' as any,
        dueDate: '2023-01-15' as any,
        lateFee: 0,
        status: 'PAID',
        subscriptionId: 1,
        applicationId: 1,
        subscriptionNumber: 'SUB-001',
        policyName: 'Gold Plan',
    } as PremiumPayment;

    const mockPaginatedResponse = {
        success: true,
        message: 'Success',
        data: {
            data: [mockPayment],
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
            providers: [PremiumPaymentService]
        });
        service = TestBed.inject(PremiumPaymentService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('makePayment', () => {
        it('should make an HTTP POST request to create a payment', () => {
            const payload = { amount: 500, paymentMethod: 'CREDIT_CARD' };
            service.makePayment(payload).subscribe(res => {
                expect(res).toEqual(mockPayment);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush({ success: true, data: mockPayment });
        });

        it('should capture custom HTTP errors correctly', () => {
            service.makePayment({}).subscribe({
                error: err => expect(err.message).toBe('Stripe charge failed')
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments`);
            req.flush({ message: 'Stripe charge failed' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('getMyPayments', () => {
        it('should request paginated payments list', () => {
            service.getMyPayments(1, 5).subscribe(res => {
                expect(res.data[0]).toEqual(mockPayment);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments/my?page=1&size=5`);
            expect(req.request.method).toBe('GET');
            req.flush(mockPaginatedResponse);
        });

        it('should unpack fallback wrapper properly', () => {
            service.getMyPayments().subscribe(res => {
                expect(res.data[0]).toEqual(mockPayment);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments/my?page=0&size=10`);
            req.flush(mockPaginatedResponse.data); // direct structure
        });
    });

    describe('getById', () => {
        it('should retrieve a single payment by ID', () => {
            service.getById(1).subscribe(res => {
                 expect(res).toEqual(mockPayment);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments/1`);
            expect(req.request.method).toBe('GET');
            req.flush({ success: true, data: mockPayment });
        });

        it('should handle getById failure via explicit thrown message', () => {
            service.getById(99).subscribe({
                 error: err => expect(err.message).toBe('Payment not found')
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/premium-payments/99`);
            req.flush({ success: false, message: 'Payment not found' });
        });
    });
});
