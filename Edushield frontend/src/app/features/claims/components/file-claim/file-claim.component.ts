import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ClaimService } from '../../services/claim.service';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PolicySubscription } from '../../../../core/models/interfaces';
import { DocumentService } from '../../../document/services/document.service';

@Component({
    selector: 'app-file-claim',
    standalone: true,
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './file-claim.component.html'
})
export class FileClaimComponent implements OnInit {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    private claimApi = inject(ClaimService);
    private subApi = inject(SubscriptionService);
    private documentApi = inject(DocumentService);
    router = inject(Router);
    toast = inject(ToastService);
    loading = signal(false);
    submitted = signal(false);
    claimRef = Math.floor(Math.random() * 90000) + 10000;

    requiredDocs = signal<any[]>([]);
    uploadedFiles = signal<Map<string, File>>(new Map());

    claimTypes = [
        { value: 'MATURITY', icon: '🎓', label: 'Maturity' },
        { value: 'DEATH', icon: '💔', label: 'Death Benefit' },
        { value: 'PARTIAL_WITHDRAWAL', icon: '💰', label: 'Partial Withdrawal' },
    ];

    form = this.fb.group({
        subscriptionId: ['', Validators.required],
        claimType: ['', Validators.required],
        claimAmount: [null, [Validators.required, Validators.min(1), Validators.max(0)]],
        reason: [''],
        scoreSecured: [null as number | null],
    });

    subscriptions = signal<PolicySubscription[]>([]);
    selectedSubscription = signal<PolicySubscription | null>(null);
    maxClaimAmount = signal<number>(0);

    // Custom validator for claim amount max
    claimAmountMaxValidator = (maxAmount: number) => {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) return null;
            const value = parseFloat(control.value);
            if (isNaN(value)) return { 'claimAmountInvalid': true };
            if (value > maxAmount) {
                return { 'max': { 'max': maxAmount, 'actual': value } };
            }
            return null;
        };
    };

    ngOnInit() {
        this.subApi.getMySubscriptions(0, 50).subscribe({
            next: (res: any) => {
                let subs: PolicySubscription[] = [];
                if (Array.isArray(res)) subs = res;
                else if (res?.data && Array.isArray(res.data)) subs = res.data;
                else if (res?.content && Array.isArray(res.content)) subs = res.content;
                this.subscriptions.set(subs.filter((s: PolicySubscription) => s.status === 'ACTIVE'));
            },
            error: () => this.subscriptions.set([])
        });

        this.form.valueChanges.subscribe(val => {
            const subId = val.subscriptionId;
            const claimType = val.claimType;
            
            // Update max claim amount based on subscription and claim type
            if (subId && claimType) {
                const sub = this.subscriptions().find(s => s.subscriptionId === +subId);
                if (sub) {
                    this.selectedSubscription.set(sub);
                    this.updateMaxClaimAmount(claimType, sub);
                }
            } else {
                // Reset if no subscription or claim type
                this.maxClaimAmount.set(0);
                const claimAmountCtrl = this.form.get('claimAmount');
                claimAmountCtrl?.setValidators([Validators.required, Validators.min(1), Validators.max(0)]);
                claimAmountCtrl?.updateValueAndValidity({ emitEvent: false });
            }
            if (subId) {
                const sub = this.subscriptions().find(s => s.subscriptionId === +subId);
                if (sub) {
                    const policyId = (sub as any).policyId || (sub as any).policy?.policyId;
                    const pName = sub.policyName || '';
                    let docs: any[] = [];

                    if (pName.includes('BrightFuture')) {
                        docs = [{ documentType: 'Hospital Bill' }, { documentType: 'School Admission Letter' }];
                    } else if (pName.includes('ScholarSecure')) {
                        docs = [{ documentType: 'College Fee Receipt' }, { documentType: 'Student ID' }];
                    } else if (pName.includes('DreamAchiever')) {
                        docs = [{ documentType: 'Fee Receipt' }, { documentType: 'Medical Certificate' }];
                    } else if (pName.includes('Comprehensive')) {
                        docs = [{ documentType: 'Medical Certificate' }, { documentType: 'School Fee Receipt' }];
                    } else if (pName.includes('Basic')) {
                        docs = [{ documentType: 'Claim Letter' }];
                    } else {
                        // Fallback for custom dynamic policies added by admin
                        this.documentApi.getRequirements(policyId, 'CLAIM').subscribe({
                            next: (res) => {
                                let requirements = res.data || [];
                                if (claimType === 'DEATH') {
                                    requirements = requirements.map((d: any) => d.documentType === 'Medical Certificate' ? { ...d, documentType: 'Death Certificate' } : d);
                                }
                                this.requiredDocs.set(requirements);
                            },
                            error: () => this.requiredDocs.set([])
                        });
                        return;
                    }

                    if (claimType === 'DEATH') {
                        docs = [{ documentType: 'Death Certificate' }];
                    } else if (claimType === 'MATURITY') {
                        docs = [{ documentType: 'School Fee Receipt' }, { documentType: 'Marks Sheet' }];
                    } else if (claimType === 'PARTIAL_WITHDRAWAL') {
                        docs = [{ documentType: 'Other Documents (Reason Proof)' }];
                    }

                    this.requiredDocs.set(docs);
                }
            } else {
                this.requiredDocs.set([]);
            }
        });
        this.form.get('claimType')?.valueChanges.subscribe(type => {
            const scoreCtrl = this.form.get('scoreSecured');
            const claimAmountCtrl = this.form.get('claimAmount');
            
            if (type === 'MATURITY') {
                scoreCtrl?.setValidators([Validators.required, Validators.min(85), Validators.max(100)]);
            } else {
                scoreCtrl?.clearValidators();
                scoreCtrl?.setValue(null);
            }
            scoreCtrl?.updateValueAndValidity({ emitEvent: false });

            const reasonCtrl = this.form.get('reason');
            if (type === 'PARTIAL_WITHDRAWAL') {
                reasonCtrl?.setValidators([Validators.required]);
            } else {
                reasonCtrl?.clearValidators();
            }
            reasonCtrl?.updateValueAndValidity({ emitEvent: false });
            
            // Reset claim amount when claim type changes
            claimAmountCtrl?.reset(null, { emitEvent: false });
            claimAmountCtrl?.updateValueAndValidity({ emitEvent: false });
        });
    }

    onFileSelected(event: any, docType: string) {
        const file = event.target.files[0];
        if (file) {
            const newMap = new Map(this.uploadedFiles());
            newMap.set(docType, file);
            this.uploadedFiles.set(newMap);
        }
    }

    canSubmit(): boolean {
        if (this.form.invalid) return false;
        if (this.requiredDocs().length > 0) {
            return this.uploadedFiles().size === this.requiredDocs().length;
        }
        return true;
    }

    updateMaxClaimAmount(claimType: string, subscription: PolicySubscription) {
        // Set max claim amount based on claim type
        const claimAmountCtrl = this.form.get('claimAmount');
        let maxAmount = 0;
        
        if (claimType === 'MATURITY') {
            // For maturity: cannot exceed coverage amount
            maxAmount = subscription.coverageAmount || 0;
        } else if (claimType === 'DEATH') {
            // For death benefit: use deathBenefitMultiplier if available, or full coverage
            maxAmount = (subscription as any).deathBenefitAmount || subscription.coverageAmount || 0;
        } else if (claimType === 'PARTIAL_WITHDRAWAL') {
            // For partial withdrawal: typically 50% of coverage amount
            maxAmount = (subscription.coverageAmount || 0) * 0.5;
        }
        
        this.maxClaimAmount.set(maxAmount);
        
        // Use custom validator with the calculated max amount
        claimAmountCtrl?.setValidators([
            Validators.required,
            Validators.min(1),
            this.claimAmountMaxValidator(maxAmount)
        ]);
        
        claimAmountCtrl?.updateValueAndValidity({ emitEvent: false });
    }

    onSubmit() {
        if (this.form.invalid) { this.form.markAllAsTouched(); return; }
        this.loading.set(true);
        // Backend expects LocalDate as YYYY-MM-DD string
        const today = new Date().toISOString().split('T')[0];
        this.claimApi.fileClaim({
            claimType: this.form.value.claimType!,
            claimAmount: Number(this.form.value.claimAmount) as any,
            claimDate: today as any,
            subscriptionId: +this.form.value.subscriptionId!,
            reason: this.form.value.reason || undefined,
        } as any).subscribe({
            next: (claimRes: any) => {
                const claimId = claimRes.data ? claimRes.data.claimId : (claimRes.claimId || claimRes);
                const user = this.auth.currentUser();

                if (this.requiredDocs().length === 0) {
                    this.loading.set(false);
                    this.submitted.set(true);
                    return;
                }

                let uploadsCompleted = 0;
                this.uploadedFiles().forEach((file, docType) => {
                    this.documentApi.uploadDocument(file, null, claimId, docType, user?.userId || 1).subscribe({
                        next: () => {
                            uploadsCompleted++;
                            if (uploadsCompleted === this.requiredDocs().length) {
                                this.loading.set(false);
                                this.submitted.set(true);
                            }
                        },
                        error: () => {
                            uploadsCompleted++;
                            if (uploadsCompleted === this.requiredDocs().length) {
                                this.loading.set(false);
                                this.toast.error('Claim filed but some documents failed to upload.');
                                this.submitted.set(true);
                            }
                        }
                    });
                });
            },
            error: err => {
                this.loading.set(false);
                this.toast.error(err.message || 'Failed to file claim');
            }
        });
    }
}
