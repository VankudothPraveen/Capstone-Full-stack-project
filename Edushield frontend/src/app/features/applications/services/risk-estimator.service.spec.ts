import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RiskEstimatorService, RiskRequest, RiskResult } from './risk-estimator.service';
import { environment } from '../../../../environments/environment';

describe('RiskEstimatorService', () => {
    let service: RiskEstimatorService;
    let httpTestingController: HttpTestingController;

    const mockRequest: RiskRequest = {
        parentAge: 35,
        occupation: 'Software Engineer',
        annualIncome: 100000,
        coverageAmount: 500000,
        policyId: 1
    };

    const mockResult: RiskResult = {
        riskScore: 12,
        riskCategory: 'LOW',
        calculatedPremium: 1000
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [RiskEstimatorService]
        });
        service = TestBed.inject(RiskEstimatorService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('calculate', () => {
        it('should send a POST request to calculate risk and unpack wrapped response', () => {
             service.calculate(mockRequest).subscribe(res => {
                 expect(res).toEqual(mockResult);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/risk/calculate`);
             expect(req.request.method).toBe('POST');
             expect(req.request.body).toEqual(mockRequest);
             // Return wrapped response
             req.flush({ success: true, data: mockResult });
        });

        it('should handle direct raw RiskCalculationResponse format', () => {
             service.calculate(mockRequest).subscribe(res => {
                 expect(res.riskScore).toBe(12);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/risk/calculate`);
             // Direct structure without 'data' or 'success' fields
             req.flush(mockResult);
        });

        it('should throw Unexpected response format if format is invalid', () => {
             service.calculate(mockRequest).subscribe({
                 error: err => expect(err.message).toBe('Unexpected response format')
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/risk/calculate`);
             req.flush({ success: true, data: null });
        });

        it('should capture http errors correctly', () => {
            service.calculate(mockRequest).subscribe({
                 error: err => expect(err.message).toBe('Risk calculation failed due to network')
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/risk/calculate`);
            req.flush({ message: 'Risk calculation failed due to network' }, { status: 500, statusText: 'Internal Server Error' });
        });
    });

    describe('getRiskCategoryColor', () => {
        it('should return specific colors based on categories', () => {
            expect(service.getRiskCategoryColor('LOW')).toBe('text-green-600 bg-green-100');
            expect(service.getRiskCategoryColor('MEDIUM')).toBe('text-yellow-700 bg-yellow-100');
            expect(service.getRiskCategoryColor('HIGH')).toBe('text-orange-700 bg-orange-100');
            expect(service.getRiskCategoryColor('VERY_HIGH')).toBe('text-red-700 bg-red-100');
            expect(service.getRiskCategoryColor('UNKNOWN')).toBe('text-gray-600 bg-gray-100');
        });
    });

    describe('getMultiplierForCategory', () => {
        it('should return the correct premium multiplier depending on category', () => {
            expect(service.getMultiplierForCategory('LOW')).toBe(1.0);
            expect(service.getMultiplierForCategory('MEDIUM')).toBe(1.2);
            expect(service.getMultiplierForCategory('HIGH')).toBe(1.5);
            expect(service.getMultiplierForCategory('VERY_HIGH')).toBe(2.0);
            expect(service.getMultiplierForCategory('UNKNOWN')).toBe(1.0);
        });
    });

    it('should expose OCCUPATIONS array', () => {
        expect(service.OCCUPATIONS.length).toBeGreaterThan(0);
        expect(service.OCCUPATIONS).toContain('Software Engineer');
    });
});
