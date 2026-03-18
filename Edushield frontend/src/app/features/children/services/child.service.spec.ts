import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChildService } from './child.service';
import { environment } from '../../../../environments/environment';
import { Child } from '../../../core/models/interfaces';

describe('ChildService', () => {
    let service: ChildService;
    let httpTestingController: HttpTestingController;

    const mockChild: Child = {
        childId: 1,
        childName: 'Test Child',
        dateOfBirth: '2020-01-01' as any,
        gender: 'MALE',
        schoolName: 'Test School',
        educationGoal: 'Engineering',
        userId: 1,
    } as Child;

    const mockPaginatedResponse = {
        success: true,
        message: 'Success',
        data: {
            data: [mockChild],
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
            providers: [ChildService]
        });
        service = TestBed.inject(ChildService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('register', () => {
        it('should send a POST request to register a child', () => {
            const payload = { childName: 'Test Child' };
            service.register(payload).subscribe(res => {
                expect(res).toEqual(mockChild);
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/children`);
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(payload);
            req.flush({ success: true, data: mockChild });
        });

        it('should handle registration errors', () => {
            service.register({}).subscribe({
                error: err => expect(err.message).toBe('Registration Failed')
            });

            const req = httpTestingController.expectOne(`${environment.apiBase}/children`);
            req.flush({ message: 'Registration Failed' }, { status: 400, statusText: 'Bad Request' });
        });
    });

    describe('getMyChildren', () => {
        it('should support pagination over my children', () => {
             service.getMyChildren(0, 10).subscribe(res => {
                 expect(res.data[0]).toEqual(mockChild);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/my?page=0&size=10`);
             expect(req.request.method).toBe('GET');
             req.flush(mockPaginatedResponse);
        });

        it('should handle direct format response', () => {
             service.getMyChildren(0, 10).subscribe(res => {
                 expect(res.data[0]).toEqual(mockChild);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/my?page=0&size=10`);
             req.flush(mockPaginatedResponse.data);
        });
    });

    describe('getById', () => {
        it('should fetch a single child by id', () => {
             service.getById(1).subscribe(res => {
                 expect(res).toEqual(mockChild);
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/1`);
             expect(req.request.method).toBe('GET');
             req.flush({ success: true, data: mockChild });
        });

        it('should throw error when success is false', () => {
             service.getById(99).subscribe({
                 error: err => expect(err.message).toBe('Child not found')
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/99`);
             req.flush({ success: false, message: 'Child not found' });
        });
    });

    describe('update', () => {
        it('should send a PUT request to update child', () => {
             service.update(1, { childName: 'Updated' }).subscribe(res => {
                 expect(res.childName).toEqual('Test Child');
             });

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/1`);
             expect(req.request.method).toBe('PUT');
             expect(req.request.body).toEqual({ childName: 'Updated' });
             req.flush({ success: true, data: mockChild });
        });
    });

    describe('delete', () => {
        it('should send a DELETE request', () => {
             service.delete(1).subscribe();

             const req = httpTestingController.expectOne(`${environment.apiBase}/children/1`);
             expect(req.request.method).toBe('DELETE');
             req.flush({ success: true, data: null });
        });
    });
});
