import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './forgot-password.component.html'
})
export class ForgotPasswordComponent {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    
    // States: 'email' -> 'code' -> 'success'
    step = signal<'email' | 'code' | 'success'>('email');
    loading = signal(false);
    errorMsg = signal('');

    // Form for step 1
    emailForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
    
    // Form for step 2
    resetForm = this.fb.group({
        token: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    onEmailSubmit() {
        if (this.emailForm.invalid) { this.emailForm.markAllAsTouched(); return; }
        this.loading.set(true);
        this.errorMsg.set('');
        
        const email = this.emailForm.value.email!;
        
        this.auth.forgotPassword(email).subscribe({
            next: () => { 
                this.loading.set(false); 
                this.step.set('code'); 
            },
            error: (err: any) => { 
                this.loading.set(false); 
                this.errorMsg.set(err.message); 
            }
        });
    }

    onResetSubmit() {
        if (this.resetForm.invalid) { this.resetForm.markAllAsTouched(); return; }
        this.loading.set(true);
        this.errorMsg.set('');

        const data = {
            email: this.emailForm.value.email!,
            token: this.resetForm.value.token!,
            newPassword: this.resetForm.value.password!
        };

        this.auth.resetPassword(data).subscribe({
            next: () => {
                this.loading.set(false);
                this.step.set('success');
            },
            error: (err: any) => {
                this.loading.set(false);
                this.errorMsg.set(err.message);
            }
        });
    }

    tryAgain() {
        this.step.set('email');
        this.resetForm.reset();
        this.errorMsg.set('');
    }
}
