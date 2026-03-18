import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NomineeService } from './nominee.service';
import { environment } from '../../../../environments/environment';
import { Nominee } from '../../../core/models/interfaces';

describe('NomineeService', () => {
    let service: NomineeService;
    let httpTestingController: HttpTestingController;

    const mockNominee: Nominee = {
        nomineeId: 1,
        nomineeName: 'Test Nominee',
        relationship: 'GUARDIAN',
        phone: '1234567890',
        applicationId: 1,
    } as Nominee;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [NomineeService]
        });
        service = TestBed.inject(NomineeService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('add', () => {
        it('should send a POST request with the new nominee', () => {
            const payload = { nomineeName: 'Test Nominee' };
            service.add(payload).subscribe(res => {
                expect(res).toEqual(mockNominee);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/nominees`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush({ success: true, data: mockNominee });
        });

        it('should capture HTTP errors properly during add', () => {
            service.add({}).subscribe({
                error: (err) => expect(err.message).toBe('Add Nominee Failed')
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/nominees`);
            req.flush({ message: 'Add Nominee Failed' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('getByApplicationId', () => {
        it('should fetch the nominee attached to an application', () => {
            service.getByApplicationId(1).subscribe(res => {
                expect(res).toEqual(mockNominee);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/nominees/application/1`);
            expect(req.request.method).toBe('GET');
            req.flush({ success: true, data: mockNominee });
        });
    });

    describe('getById', () => {
        it('should fetch an explicitly known nominee by ID', () => {
             service.getById(1).subscribe(res => {
                 expect(res).toEqual(mockNominee);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/nominees/1`);
             expect(req.request.method).toBe('GET');
             req.flush({ success: true, data: mockNominee });
        });

        it('should throw an error with backend message when success is false', () => {
             service.getById(99).subscribe({
                 error: err => expect(err.message).toBe('Nominee not found')
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/nominees/99`);
             req.flush({ success: false, message: 'Nominee not found' });
        });
    });

    describe('update', () => {
        it('should actuate a PUT request applying partial nominee modifications', () => {
             service.update(1, { nomineeName: 'Updated' }).subscribe(res => {
                 expect(res.nomineeName).toEqual('Test Nominee');
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/nominees/1`);
             expect(req.request.method).toBe('PUT');
             expect(req.request.body).toEqual({ nomineeName: 'Updated' });
             req.flush({ success: true, data: mockNominee });
        });
    });

    describe('delete', () => {
        it('should generate a valid HTTP DELETE operation', () => {
             service.delete(1).subscribe();

             const req = httpTestingController.expectOne(`${environment.apiBase}/nominees/1`);
             expect(req.request.method).toBe('DELETE');
             req.flush({ success: true, data: null });
        });
    });
});
