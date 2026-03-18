import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ChildService } from '../../services/child.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
    selector: 'app-child-form',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './child-form.component.html'
})
export class ChildFormComponent implements OnInit {
    fb = inject(FormBuilder);
    route = inject(ActivatedRoute);
    router = inject(Router);
    auth = inject(AuthService);
    private childApi = inject(ChildService);
    toast = inject(ToastService);
    loading = signal(false);
    isEdit = signal(false);
    childId = signal<number | null>(null);

    maxDob = new Date().toISOString().split('T')[0];
    minDob = new Date(Date.now() - 18 * 365.25 * 24 * 3600 * 1000).toISOString().split('T')[0];

    form = this.fb.group({
        childName: ['', [Validators.required, Validators.minLength(2)]],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        schoolName: ['', Validators.required],
        educationGoal: ['', Validators.required],
    });

    get f() { return this.form.controls; }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit.set(true);
            this.childId.set(+id);
            this.childApi.getById(+id).subscribe({
                next: child => {
                    this.form.patchValue({
                        childName: child.childName,
                        dateOfBirth: new Date(child.dateOfBirth).toISOString().split('T')[0],
                        gender: child.gender,
                        schoolName: child.schoolName,
                        educationGoal: child.educationGoal,
                    });
                },
                error: err => this.toast.error(err.message || 'Failed to load child')
            });
        }
    }

    onSubmit() {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.loading.set(true);
        const v = this.form.value;
        const payload = {
            childName: v.childName!,
            dateOfBirth: new Date(v.dateOfBirth!),
            gender: v.gender!,
            schoolName: v.schoolName!,
            educationGoal: v.educationGoal!,
        };

        if (this.isEdit()) {
            this.childApi.update(this.childId()!, payload).subscribe({
                next: () => {
                    this.loading.set(false);
                    this.toast.success('Child updated successfully!');
                    this.router.navigate(['/children/list']);
                },
                error: err => {
                    this.loading.set(false);
                    this.toast.error(err.message || 'Failed to update child');
                }
            });
        } else {
            this.childApi.register(payload).subscribe({
                next: () => {
                    this.loading.set(false);
                    this.toast.success('Child added successfully!');
                    this.router.navigate(['/children/list']);
                },
                error: err => {
                    this.loading.set(false);
                    this.toast.error(err.message || 'Failed to add child');
                }
            });
        }
    }
}
