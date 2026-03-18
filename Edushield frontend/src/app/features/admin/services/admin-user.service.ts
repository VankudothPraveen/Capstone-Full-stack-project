import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { User } from '../../../core/models/interfaces';

export interface CreateStaffRequest {
    name: string;
    email: string;
    password: string;
    role: 'UNDERWRITER' | 'CLAIMS_OFFICER';
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
    private base = `${environment.apiBase}/users`;
    private adminBase = `${environment.apiBase}/admin/users`;

    constructor(private http: HttpClient) { }

    getAllUsers(page = 0, size = 100): Observable<User[]> {
        const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
        return this.http.get<any>(this.base, { params }).pipe(
            map(res => {
                if (Array.isArray(res)) return res;
                if (res?.data && Array.isArray(res.data)) return res.data;
                if (res?.content && Array.isArray(res.content)) return res.content;
                if (res?.data?.content && Array.isArray(res.data.content)) return res.data.content;
                return [];
            }),
            catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to load users')))
        );
    }

    createStaff(payload: CreateStaffRequest): Observable<User> {
        return this.http.post<ApiResponse<User>>(`${this.adminBase}/create-staff`, payload).pipe(
            map(res => {
                if (res.success) return res.data;
                throw new Error(res.message);
            }),
            catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to create staff account')))
        );
    }

    updateUserStatus(userId: number, active: boolean): Observable<User> {
        return this.http.patch<ApiResponse<User>>(`${this.adminBase}/${userId}/status`, { active }).pipe(
            map(res => {
                if (res.success) return res.data;
                throw new Error(res.message);
            }),
            catchError(err => throwError(() => new Error(err?.error?.message || err?.message || 'Failed to update user status')))
        );
    }

    deleteUser(userId: number): Observable<any> {
        return this.http.delete(`${this.base}/${userId}`, { responseType: 'text' }).pipe(
            map(() => true),
            catchError(err => {
                let realMsg = err?.message || 'Failed to delete user';
                if (typeof err?.error === 'string') {
                    try {
                        const parsed = JSON.parse(err.error);
                        if (parsed.message) realMsg = parsed.message + (parsed.details ? ': ' + parsed.details : '');
                    } catch (e) { }
                } else if (err?.error?.message) {
                    realMsg = err.error.message + (err.error.details ? ': ' + err.error.details : '');
                }
                return throwError(() => new Error(realMsg));
            })
        );
    }
}
