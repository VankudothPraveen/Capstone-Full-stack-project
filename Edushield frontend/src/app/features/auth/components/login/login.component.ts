import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { SocialAuthService, GoogleLoginProvider, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink, GoogleSigninButtonModule],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    socialAuth = inject(SocialAuthService);
    router = inject(Router);
    toast = inject(ToastService);
    loading = signal(false);
    errorMsg = signal('');
    showPassword = signal(false);

    loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
    });

    features = [
        { icon: '🛡️', title: 'Risk Protection', desc: 'Up to ₹25 Lakh coverage for your family' },
        { icon: '🎓', title: 'Education Funding', desc: 'Guaranteed returns at policy maturity' },
        { icon: '💰', title: 'Tax Benefits', desc: 'Save tax under Section 80C & 10(10D)' },
        { icon: '🔔', title: 'Premium Waiver', desc: 'Future premiums waived on death of parent' },
    ];

    ngOnInit() {
        this.socialAuth.authState.subscribe((user: SocialUser) => {
            if (user && user.idToken) {
                this.loginWithGoogle(user.idToken);
            }
        });
    }



    loginWithGoogle(token: string) {
        this.loading.set(true);
        this.errorMsg.set('');
        this.auth.loginWithGoogle(token).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.toast.success(`Welcome, ${res.user.name}!`);
                this.handleNavigation(res.user);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMsg.set(err.message);
            }
        });
    }

    onSubmit() {
        if (this.loginForm.invalid) { this.loginForm.markAllAsTouched(); return; }
        this.loading.set(true);
        this.errorMsg.set('');
        const { email, password } = this.loginForm.value;
        this.auth.login({ email: email!, password: password! }).subscribe({
            next: (res) => {
                this.loading.set(false);
                this.toast.success(`Welcome back, ${res.user.name}!`);
                this.handleNavigation(res.user);
            },
            error: (err) => {
                this.loading.set(false);
                this.errorMsg.set(err.message);
            }
        });
    }

    handleNavigation(user: any) {
        const role = (user.role || user.roleName || '').toUpperCase();
        if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
        } else if (role === 'ROLE_UNDERWRITER' || role === 'UNDERWRITER') {
            this.router.navigate(['/underwriter/dashboard']);
        } else if (role === 'ROLE_CLAIMS_OFFICER' || role === 'CLAIMS_OFFICER') {
            this.router.navigate(['/claims/dashboard']);
        } else {
            this.router.navigate(['/dashboard']);
        }
    }
}
