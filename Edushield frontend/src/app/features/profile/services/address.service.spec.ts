import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AddressService } from './address.service';
import { environment } from '../../../../environments/environment';
import { Address } from '../../../core/models/interfaces';

describe('AddressService', () => {
  let service: AddressService;
  let httpMock: HttpTestingController;

  const mockAddress: Address = {
    addressId: 1,
    street: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    pincode: '62704',
    userId: 1
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AddressService]
    });
    service = TestBed.inject(AddressService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create an address', () => {
    service.create(mockAddress).subscribe(res => {
      expect(res).toEqual(mockAddress);
    });

    const req = httpMock.expectOne(`${environment.apiBase}/addresses`);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true, data: mockAddress });
  });

  it('should get current user address', () => {
    service.getMyAddress().subscribe(res => {
      expect(res).toEqual(mockAddress);
    });

    const req = httpMock.expectOne(`${environment.apiBase}/addresses/my`);
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockAddress });
  });

  it('should return null if getMyAddress fails or is empty', () => {
    service.getMyAddress().subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiBase}/addresses/my`);
    req.flush({ success: false, data: null });
  });

  it('should update an address', () => {
    service.update(1, mockAddress).subscribe(res => {
      expect(res).toEqual(mockAddress);
    });

    const req = httpMock.expectOne(`${environment.apiBase}/addresses/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true, data: mockAddress });
  });

  it('should delete an address', () => {
    service.delete(1).subscribe();

    const req = httpMock.expectOne(`${environment.apiBase}/addresses/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });
});
