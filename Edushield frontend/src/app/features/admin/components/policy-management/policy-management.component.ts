import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { AdminPolicyService } from '../../services/admin-policy.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Policy } from '../../../../core/models/interfaces';

@Component({
    selector: 'app-policy-management', standalone: true, imports: [ReactiveFormsModule, FormsModule],
    templateUrl: './policy-management.component.html'
})
export class PolicyManagementComponent implements OnInit {
    fb = inject(FormBuilder);
    private policyApi = inject(AdminPolicyService);
    toast = inject(ToastService);
    showForm = signal(false);
    editingId = signal<number | null>(null);
    policies = signal<Policy[]>([]);
    searchQuery = signal('');
    private _editingIsActive = true;

    filteredPolicies = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        return this.policies().filter(p => 
            !query || 
            p.policyName?.toLowerCase().includes(query) || 
            p.description?.toLowerCase().includes(query)
        );
    });

    form = this.fb.group({
        policyName: ['', Validators.required], basePremium: [null, [Validators.required, Validators.min(1)]],
        durationYears: [null, Validators.required], bonusPercentage: [null, Validators.required],
        riskCoverageAmount: [null, Validators.required], minChildAge: [0, Validators.required],
        maxChildAge: [18, Validators.required], maturityBenefitAmount: [null, Validators.required],
        deathBenefitMultiplier: [2, Validators.required], waiverOfPremium: [false],
        description: ['', Validators.required],
    });

    ngOnInit() { this.loadPolicies(); }

    private loadPolicies() {
        this.policyApi.getAll(0, 100).subscribe({
            next: res => this.policies.set(res.data),
            error: () => this.policies.set([])
        });
    }

    editPolicy(p: any) {
        this.editingId.set(p.policyId); this.showForm.set(true);
        this.form.patchValue({ ...p });
        this._editingIsActive = p.isActive;
    }

    cancelForm() { this.showForm.set(false); this.editingId.set(null); this.form.reset(); }

    onSubmit() {
        if (this.form.invalid) return;
        const raw = this.form.value as any;
        const payload: any = {
            policyName: raw.policyName,
            basePremium: raw.basePremium !== null && raw.basePremium !== '' ? Number(raw.basePremium) : null,
            durationYears: raw.durationYears !== null && raw.durationYears !== '' ? Number(raw.durationYears) : null,
            bonusPercentage: raw.bonusPercentage !== null && raw.bonusPercentage !== '' ? Number(raw.bonusPercentage) : null,
            riskCoverageAmount: raw.riskCoverageAmount !== null && raw.riskCoverageAmount !== '' ? Number(raw.riskCoverageAmount) : null,
            minChildAge: raw.minChildAge !== null && raw.minChildAge !== '' ? Number(raw.minChildAge) : null,
            maxChildAge: raw.maxChildAge !== null && raw.maxChildAge !== '' ? Number(raw.maxChildAge) : null,
            maturityBenefitAmount: raw.maturityBenefitAmount !== null && raw.maturityBenefitAmount !== '' ? Number(raw.maturityBenefitAmount) : null,
            deathBenefitMultiplier: raw.deathBenefitMultiplier !== null && raw.deathBenefitMultiplier !== '' ? Number(raw.deathBenefitMultiplier) : null,
            waiverOfPremium: raw.waiverOfPremium === true || raw.waiverOfPremium === 'true',
            description: raw.description || '',
            isActive: this.editingId() ? this._editingIsActive : true,
        };
        if (this.editingId()) {
            this.policyApi.update(this.editingId()!, payload).subscribe({
                next: () => { this.toast.success('Policy updated!'); this.cancelForm(); this.loadPolicies(); },
                error: err => this.toast.error(err.message || 'Failed to update')
            });
        } else {
            this.policyApi.create(payload).subscribe({
                next: () => { this.toast.success('Policy created!'); this.cancelForm(); this.loadPolicies(); },
                error: err => this.toast.error(err.message || 'Failed to create')
            });
        }
    }

    toggleActive(id: number) {
        const p = this.policies().find(x => x.policyId === id);
        if (!p) return;
        const req$ = p.isActive ? this.policyApi.deactivate(id) : this.policyApi.activate(id);
        req$.subscribe({
            next: () => { this.toast.info('Policy status updated!'); this.loadPolicies(); },
            error: err => this.toast.error(err.message || 'Failed to update status')
        });
    }

    deletePolicy(id: number, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;
        this.policyApi.delete(id).subscribe({
            next: () => { this.toast.success('Policy deleted successfully'); this.loadPolicies(); },
            error: err => this.toast.error(err.message || 'Failed to delete policy')
        });
    }
}
