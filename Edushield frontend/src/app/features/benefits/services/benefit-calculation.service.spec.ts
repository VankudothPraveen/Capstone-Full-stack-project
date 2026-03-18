import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BenefitCalculationService } from './benefit-calculation.service';
import { environment } from '../../../../environments/environment';
import { BenefitCalculation } from '../../../core/models/interfaces';

describe('BenefitCalculationService', () => {
    let service: BenefitCalculationService;
    let httpMock: HttpTestingController;

    const mockResult: BenefitCalculation = {
        calculationId: 1,
        calculationDate: new Date(),
        baseAmount: 1000,
        loyaltyBonus: 100,
        guaranteedAddition: 50,
        annualIncrement: 20,
        totalBenefit: 1170,
        benefitType: 'MATURITY',
        subscriptionId: 1
    };

    const mockPaginatedResponse = {
        data: [mockResult],
        pageNumber: 0,
        pageSize: 20,
        totalElements: 1,
        totalPages: 1,
        isFirst: true,
        isLast: true
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BenefitCalculationService]
        });
        service = TestBed.inject(BenefitCalculationService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should get my calculations', () => {
        service.getMyCalculations(0, 5).subscribe(res => {
            expect(res.data.length).toBe(1);
            expect(res.data[0]).toEqual(mockResult);
        });

        const req = httpMock.expectOne(`${environment.apiBase}/benefit-calculations/my?page=0&size=5`);
        expect(req.request.method).toBe('GET');
        req.flush(mockPaginatedResponse);
    });

    it('should get calculation by id', () => {
        service.getById(1).subscribe(res => {
            expect(res).toEqual(mockResult);
        });

        const req = httpMock.expectOne(`${environment.apiBase}/benefit-calculations/1`);
        expect(req.request.method).toBe('GET');
        req.flush({ success: true, data: mockResult });
    });

    it('should get calculations by subscription id', () => {
        service.getBySubscriptionId(1).subscribe(res => {
            expect(res).toEqual([mockResult]);
        });

        const req = httpMock.expectOne(`${environment.apiBase}/benefit-calculations/subscription/1`);
        expect(req.request.method).toBe('GET');
        req.flush({ success: true, data: [mockResult] });
    });

    it('should calculate new benefits', () => {
        service.calculate(1, 'MATURITY').subscribe(res => {
            expect(res).toEqual(mockResult);
        });

        const req = httpMock.expectOne(`${environment.apiBase}/benefit-calculations/calculate`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual({ subscriptionId: 1, benefitType: 'MATURITY' });
        req.flush({ success: true, data: mockResult });
    });
});
