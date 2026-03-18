import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { User } from '../../../core/models/interfaces';

@Injectable({ providedIn: 'root' })
export class UserService {
  private base = `${environment.apiBase}/users`;

  constructor(private http: HttpClient) {}

  getProfile(): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.base}/me`).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message);
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load profile')))
    );
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.base}/me`, data).pipe(
      map(res => {
        if (res.success) return res.data;
        throw new Error(res.message);
      }),
      catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update profile')))
    );
  }
}
