import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/services/auth.service';
import { AddressService } from '../../services/address.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Address } from '../../../../core/models/interfaces';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address.component.html'
})
export class AddressComponent implements OnInit {
  fb = inject(FormBuilder);
  auth = inject(AuthService);
  private addressApi = inject(AddressService);
  toast = inject(ToastService);
  loading = signal(false);
  editing = signal(false);
  address = signal<Address | null>(null);

  states = ['Andhra Pradesh', 'Telangana', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Delhi', 'Uttar Pradesh', 'West Bengal', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar'];

  form = this.fb.group({
    street: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
  });

  ngOnInit() {
    this.addressApi.getMyAddress().subscribe({
      next: addr => {
        if (addr && addr.street) {
          this.address.set(addr);
          this.form.patchValue({ street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode });
        } else {
          this.address.set(null);
        }
      },
      error: () => this.address.set(null)
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    const data = this.form.value as Partial<Address>;
    const existing = this.address();

    const req$ = existing
      ? this.addressApi.update(existing.addressId, data)
      : this.addressApi.create(data);

    req$.subscribe({
      next: addr => {
        this.address.set(addr);
        this.editing.set(false);
        this.loading.set(false);
        this.toast.success('Address saved!');
      },
      error: err => {
        this.loading.set(false);
        this.toast.error(err.message || 'Failed to save address');
      }
    });
  }
}
