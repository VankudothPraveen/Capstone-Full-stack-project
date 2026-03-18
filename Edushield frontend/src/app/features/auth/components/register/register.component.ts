import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

function passwordStrength(control: AbstractControl): ValidationErrors | null {
    const val = control.value || '';
    const hasUpper = /[A-Z]/.test(val);
    const hasLower = /[a-z]/.test(val);
    const hasNum = /\d/.test(val);
    const hasSpecial = /[@$!%*?&]/.test(val);
    const len = val.length >= 8;
    if (hasUpper && hasLower && hasNum && hasSpecial && len) return null;
    return { weakPassword: true };
}

function confirmPasswordValidator(g: AbstractControl): ValidationErrors | null {
    return g.get('password')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    router = inject(Router);
    toast = inject(ToastService);
    loading = signal(false);
    errorMsg = signal('');
    showPwd = signal(false);

    registerForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
        passwords: this.fb.group({
            password: ['', [Validators.required, passwordStrength]],
            confirmPassword: ['', Validators.required],
        }, { validators: confirmPasswordValidator }),
    });

    get f() { return this.registerForm.controls; }
    get passwords() { return this.registerForm.get('passwords') as any; }

    getStrengthScore(): number {
        const pwd = this.passwords.get('password')?.value || '';
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[@$!%*?&]/.test(pwd)) score++;
        return score;
    }

    getStrengthColor(i: number): string {
        const score = this.getStrengthScore();
        if (i > score) return 'bg-gray-200';
        if (score <= 1) return 'bg-red-400';
        if (score <= 2) return 'bg-yellow-400';
        if (score <= 3) return 'bg-blue-400';
        return 'bg-emerald-500';
    }

    getStrengthLabel(): string {
        const s = this.getStrengthScore();
        return s <= 1 ? 'Weak' : s <= 2 ? 'Medium' : s <= 3 ? 'Good' : 'Strong';
    }

    getStrengthClass(): string {
        const s = this.getStrengthScore();
        return s <= 1 ? 'text-red-500' : s <= 2 ? 'text-yellow-500' : s <= 3 ? 'text-blue-500' : 'text-emerald-600';
    }

    onSubmit() {
        if (this.registerForm.invalid) { this.registerForm.markAllAsTouched(); return; }
        this.loading.set(true);
        this.errorMsg.set('');
        const { name, email, phone } = this.registerForm.value;
        const password = this.passwords.get('password')?.value;
        this.auth.register({ name: name!, email: email!, phone: phone!, password }).subscribe({
            next: () => {
                this.loading.set(false);
                this.toast.success('Account created! Please sign in.');
                this.router.navigate(['/auth/login']);
            },
            error: (err: any) => { this.loading.set(false); this.errorMsg.set(err.message); }
        });
    }
}
