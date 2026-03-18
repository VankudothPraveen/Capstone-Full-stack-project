import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Address } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private base = `${environment.apiBase}/addresses`;

  constructor(private http: HttpClient) {}

  create(address: Partial<Address>): Observable<Address> {
    return this.http.post<ApiResponse<Address>>(this.base, address).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to create address')))
    );
  }

  getMyAddress(): Observable<Address | null> {
    return this.http.get<ApiResponse<Address>>(`${this.base}/my`).pipe(
      map(res => {
        if (res.success && res.data) return res.data;
        return null as any;
      }),
      catchError(() => of(null))
    );
  }

  update(addressId: number, address: Partial<Address>): Observable<Address> {
    return this.http.put<ApiResponse<Address>>(`${this.base}/${addressId}`, address).pipe(
      map(res => { if (res.success) return res.data; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update address')))
    );
  }

  delete(addressId: number): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.base}/${addressId}`).pipe(
      map(res => { if (res.success) return; throw new Error(res.message); }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to delete address')))
    );
  }
}
