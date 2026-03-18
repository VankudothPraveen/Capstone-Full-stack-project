import { Injectable, signal, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User, LoginCredentials, AuthResponse } from '../../../core/models/interfaces';
import { ApiResponse } from '../../../core/models/api-response.model';
import { environment } from '../../../../environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private base = `${environment.apiBase}/auth`;
    private currentUserSignal = signal<User | null>(this.loadUser());
    readonly currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();

    constructor(
        private http: HttpClient,
        private socialAuthService: SocialAuthService
    ) { }

    private loadUser(): User | null {
        try {
            const stored = localStorage.getItem('currentUser');
            return stored ? JSON.parse(stored) : null;
        } catch { return null; }
    }

    login(credentials: LoginCredentials): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/login`, credentials).pipe(
            map(res => {
                if (res.success && res.data) {
                    localStorage.setItem('authToken', res.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                    this.currentUserSignal.set(res.data.user);
                    return res.data;
                }
                throw new Error(res.message || 'Login failed');
            }),
            catchError(err => throwError(() => new Error(
                err?.error?.message || err?.message || 'Login failed'
            )))
        );
    }

    loginWithGoogle(token: string): Observable<AuthResponse> {
        return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/google`, { token }).pipe(
            map(res => {
                if (res.success && res.data) {
                    localStorage.setItem('authToken', res.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                    this.currentUserSignal.set(res.data.user);
                    return res.data;
                }
                throw new Error(res.message || 'Google login failed');
            }),
            catchError(err => throwError(() => new Error(
                err?.error?.message || err?.message || 'Google login failed'
            )))
        );
    }

    register(userData: Partial<User>): Observable<User> {
        const body = {
            name: userData.name,
            email: userData.email,
            password: userData.password,
            phone: userData.phone,
            role: 'USER'
        };
        return this.http.post<ApiResponse<AuthResponse>>(`${this.base}/register`, body).pipe(
            map(res => {
                if (res.success && res.data) {
                    localStorage.setItem('authToken', res.data.token);
                    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
                    this.currentUserSignal.set(res.data.user);
                    return res.data.user;
                }
                throw new Error(res.message || 'Registration failed');
            }),
            catchError(err => throwError(() => new Error(
                err?.error?.message || err?.message || 'Registration failed'
            )))
        );
    }

    async logout(): Promise<void> {
        const user = this.currentUserSignal();
        if (user?.provider === 'GOOGLE') {
            try {
                await this.socialAuthService.signOut();
            } catch (err) {
                console.warn('Google sign out failed or already signed out', err);
            }
        }
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        this.currentUserSignal.set(null);
    }

    isAuthenticated(): boolean {
        return !!localStorage.getItem('authToken');
    }

    isAdmin(): boolean {
        const user = this.currentUserSignal();
        // Check 'role' first (backend uses this), then 'roleName' as fallback
        const role = (user?.role || user?.roleName || '').toUpperCase();
        return role === 'ROLE_ADMIN' || role === 'ADMIN';
    }

    isUnderwriter(): boolean {
        const user = this.currentUserSignal();
        const role = (user?.role || user?.roleName || '').toUpperCase();
        return role === 'ROLE_UNDERWRITER' || role === 'UNDERWRITER';
    }

    isClaimsOfficer(): boolean {
        const user = this.currentUserSignal();
        const role = (user?.role || user?.roleName || '').toUpperCase();
        return role === 'ROLE_CLAIMS_OFFICER' || role === 'CLAIMS_OFFICER';
    }

    isUser(): boolean {
        return !this.isAdmin() && !this.isUnderwriter() && !this.isClaimsOfficer() && this.isAuthenticated();
    }

    getToken(): string | null {
        return localStorage.getItem('authToken');
    }

    forgotPassword(email: string): Observable<{ message: string }> {
        return this.http.post<ApiResponse<{ message: string }>>(`${this.base}/forgot-password`, { email }).pipe(
            map(res => {
                if (res.success) return { message: res.message || 'Password reset link sent to your email' };
                throw new Error(res.message || 'Request failed');
            }),
            catchError(err => throwError(() => new Error(
                err?.error?.message || err?.message || 'Request failed'
            )))
        );
    }

    resetPassword(data: { email: string; token: string; newPassword: string }): Observable<{ message: string }> {
        return this.http.post<ApiResponse<{ message: string }>>(`${this.base}/reset-password`, data).pipe(
            map(res => {
                if (res.success) return { message: res.message || 'Password reset successfully' };
                throw new Error(res.message || 'Reset failed');
            }),
            catchError(err => throwError(() => new Error(
                err?.error?.message || err?.message || 'Password reset failed'
            )))
        );
    }
}
