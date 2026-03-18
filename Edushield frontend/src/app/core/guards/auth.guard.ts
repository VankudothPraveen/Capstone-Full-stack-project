import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated()) return true;
    router.navigate(['/auth/login']);
    return false;
};

export const adminGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated() && auth.isAdmin()) return true;
    router.navigate(['/dashboard']);
    return false;
};

export const underwriterGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated() && auth.isUnderwriter()) return true;
    router.navigate(['/dashboard']);
    return false;
};

export const claimsOfficerGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (auth.isAuthenticated() && auth.isClaimsOfficer()) return true;
    router.navigate(['/dashboard']);
    return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    if (!auth.isAuthenticated()) return true;
    
    if (auth.isAdmin()) router.navigate(['/admin/dashboard']);
    else if (auth.isUnderwriter()) router.navigate(['/underwriter/dashboard']);
    else if (auth.isClaimsOfficer()) router.navigate(['/claims/dashboard']);
    else router.navigate(['/dashboard']);
    
    return false;
};
