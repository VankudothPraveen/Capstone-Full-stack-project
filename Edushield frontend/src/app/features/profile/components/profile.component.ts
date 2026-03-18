import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { UserService } from '../services/user.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private userApi = inject(UserService);
  toast = inject(ToastService);
  fb = inject(FormBuilder);
  loading = signal(false);

  form = this.fb.group({
    name: [this.auth.currentUser()?.name || '', Validators.required],
    phone: [this.auth.currentUser()?.phone || '', Validators.required],
    email: [{ value: this.auth.currentUser()?.email || '', disabled: true }],
  });

  ngOnInit() {
    this.userApi.getProfile().subscribe({
      next: user => {
        this.form.patchValue({ name: user.name, phone: user.phone, email: user.email });
      },
      error: () => {}
    });
  }

  onSubmit() {
    this.loading.set(true);
    this.userApi.updateProfile({ name: this.form.value.name!, phone: this.form.value.phone! }).subscribe({
      next: user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.loading.set(false);
        this.toast.success('Profile updated successfully!');
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(err.message || 'Failed to update profile');
      }
    });
  }
}
