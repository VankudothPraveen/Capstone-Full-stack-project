import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../auth/services/auth.service';
import { ChildService } from '../../../children/services/child.service';
import { PolicyService } from '../../../policies/services/policy.service';
import { PolicyApplicationService } from '../../services/policy-application.service';
import { NomineeService } from '../../services/nominee.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Child, Policy } from '../../../../core/models/interfaces';
import { DocumentService } from '../../../document/services/document.service';
import { RiskEstimatorService, RiskResult } from '../../services/risk-estimator.service';

@Component({
    selector: 'app-apply',
    standalone: true,
    imports: [ReactiveFormsModule, FormsModule, RouterLink],
    templateUrl: './apply.component.html'
})
export class ApplyComponent implements OnInit {
    fb = inject(FormBuilder);
    auth = inject(AuthService);
    private childApi = inject(ChildService);
    private policyApi = inject(PolicyService);
    private appApi = inject(PolicyApplicationService);
    private nomineeApi = inject(NomineeService);
    private documentApi = inject(DocumentService);
    private riskApi = inject(RiskEstimatorService);
    toast = inject(ToastService);
    router = inject(Router);

    currentStep = signal(1);
    loading = signal(false);
    selectedChild = signal<any>(null);
    selectedPolicy = signal<any>(null);
    frequencyControl = this.fb.control('MONTHLY');

    myChildren = signal<Child[]>([]);
    activePolicies = signal<Policy[]>([]);
    nomineeFormValid = signal(false);

    requiredDocs = signal<any[]>([]);
    uploadedFiles = signal<Map<string, File>>(new Map());

    // ─── Risk Assessment ───────────────────────────────────
    occupations = inject(RiskEstimatorService).OCCUPATIONS;
    parentAge = signal<number | null>(null);
    occupation = signal<string>('');
    annualIncome = signal<number | null>(null);
    coverageAmount = signal<number | null>(null);
    riskResult = signal<RiskResult | null>(null);
    riskLoading = signal(false);
    riskError = signal<string | null>(null);

    steps = [
        { id: 1, label: 'Select Child' },
        { id: 2, label: 'Select Policy' },
        { id: 3, label: 'Risk Details' },
        { id: 4, label: 'Nominee' },
        { id: 5, label: 'Documents' },
        { id: 6, label: 'Review' },
    ];

    nomineeForm = this.fb.group({
        nomineeName: ['', [Validators.required, Validators.minLength(2)]],
        relationship: ['', Validators.required],
        phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    });

    get nf() { return this.nomineeForm.controls; }

    private route = inject(ActivatedRoute);

    ngOnInit() {
        this.nomineeForm.statusChanges.subscribe(status => {
            this.nomineeFormValid.set(status === 'VALID');
        });

        this.childApi.getMyChildren(0, 50).subscribe({
            next: res => {
                const children = Array.isArray(res) ? res : (res.data || []);
                this.myChildren.set(children);
                this.checkPreSelection();
            },
            error: () => this.myChildren.set([])
        });

        this.policyApi.getAll(0, 100).subscribe({
            next: res => {
                const policies = Array.isArray(res) ? res : (res.data || []);
                this.activePolicies.set(policies);
                this.checkPreSelection();
            },
            error: () => this.activePolicies.set([])
        });
    }

    private checkPreSelection() {
        if (this.myChildren().length > 0 && this.activePolicies().length > 0) {
            this.route.queryParams.subscribe((params: any) => {
                if (params['childId']) {
                    const child = this.myChildren().find(c => c.childId === Number(params['childId']));
                    if (child) { this.selectedChild.set(child); if (this.currentStep() === 1) this.currentStep.set(2); }
                }
                if (params['policyId']) {
                    const policy = this.activePolicies().find(p => p.policyId === Number(params['policyId']));
                    if (policy?.isActive) { this.selectedPolicy.set(policy); if (this.currentStep() === 2) this.currentStep.set(3); }
                }
            });
        }
    }

    riskFormValid = computed(() => {
        const age = this.parentAge();
        const occ = this.occupation();
        const income = this.annualIncome();
        const coverage = this.coverageAmount();
        return age && age > 0 && occ.length > 0 && income && income > 0 && coverage && coverage > 0;
    });

    canProceed = computed(() => {
        if (this.currentStep() === 1) return !!this.selectedChild();
        if (this.currentStep() === 2) return !!this.selectedPolicy() && this.selectedPolicy()?.isActive === true;
        if (this.currentStep() === 3) return this.riskFormValid();
        if (this.currentStep() === 4) return this.nomineeFormValid();
        if (this.currentStep() === 5) return this.uploadedFiles().size === this.requiredDocs().length;
        return true;
    });

    // Frontend risk calculation removed; to be calculated and finalized by underwriter on backend.

    getRiskColor(category: string) {
        return this.riskApi.getRiskCategoryColor(category);
    }

    getMultiplier(category: string) {
        return this.riskApi.getMultiplierForCategory(category);
    }

    onFileSelected(event: any, docType: string) {
        const file = event.target.files[0];
        if (file) {
            const newMap = new Map(this.uploadedFiles());
            newMap.set(docType, file);
            this.uploadedFiles.set(newMap);
        }
    }

    calculateAge(dobRaw: any): number {
        if (!dobRaw) return 0;
        const dob = new Date(dobRaw);
        return Math.abs(new Date(Date.now() - dob.getTime()).getUTCFullYear() - 1970);
    }

    loadRequirements() {
        const policy = this.selectedPolicy();
        const child = this.selectedChild();
        if (policy && child) {
            const age = this.calculateAge(child.dateOfBirth);
            let docs: any[] = [
                { documentType: 'Birth Certificate' }, 
                { documentType: 'Parent / Guardian ID (Aadhar/PAN)' }
            ];

            if (age >= 3 && age <= 5) {
                docs.push({ documentType: 'Pre-school Admission Letter / Bonafide' });
            } else if (age > 5 && age <= 18) {
                let currentClass = age - 5;
                let classStr = currentClass + 'th Class';
                if (currentClass === 1) classStr = '1st Class';
                else if (currentClass === 2) classStr = '2nd Class';
                else if (currentClass === 3) classStr = '3rd Class';
                
                docs.push({ documentType: classStr + ' Bonafide Certificate / School ID' });
            } else if (age > 18) {
                docs.push({ documentType: 'College / University Bonafide Certificate' });
            }

            // You can also append policy specific docs if needed here, but standard class logic is added above
            if (policy.policyName.includes('ScholarSecure')) docs.push({ documentType: 'Previous Year Marksheet' });
            if (policy.policyName.includes('DreamAchiever')) docs.push({ documentType: 'Income Proof' });

            this.requiredDocs.set(docs);
        }
    }

    nextStep() {
        if (this.canProceed()) {
            this.currentStep.set(this.currentStep() + 1);
            if (this.currentStep() === 5) this.loadRequirements();
        }
    }

    prevStep() {
        if (this.currentStep() > 1) this.currentStep.set(this.currentStep() - 1);
    }

    reviewSections = computed(() => [
        {
            title: '👶 Child Details',
            items: [
                { label: 'Name', value: this.selectedChild()?.childName || '-' },
                { label: 'School', value: this.selectedChild()?.schoolName || '-' },
                { label: 'Education Goal', value: this.selectedChild()?.educationGoal || '-' },
            ]
        },
        {
            title: '📋 Policy Details',
            items: [
                { label: 'Policy', value: this.selectedPolicy()?.policyName || '-' },
                { label: 'Base Premium', value: '₹' + (this.selectedPolicy()?.basePremium || 0) + '/month' },
                { label: 'Duration', value: (this.selectedPolicy()?.durationYears || 0) + ' years' },
                { label: 'Payment Frequency', value: this.frequencyControl.value || 'MONTHLY' },
                { label: 'Maturity Benefit', value: '₹' + ((this.selectedPolicy()?.maturityBenefitAmount || 0) / 100000).toFixed(1) + 'L' },
            ]
        },
        {
            title: '🔬 Risk Details',
            items: [
                { label: 'Parent Age', value: this.parentAge()?.toString() || '-' },
                { label: 'Occupation', value: this.occupation() || '-' },
                { label: 'Annual Income', value: '₹' + (this.annualIncome() || 0) },
                { label: 'Coverage Amount', value: '₹' + (this.coverageAmount() || 0) },
            ]
        },
        {
            title: '👤 Nominee Details',
            items: [
                { label: 'Name', value: this.nomineeForm.value.nomineeName || '-' },
                { label: 'Relationship', value: this.nomineeForm.value.relationship || '-' },
                { label: 'Phone', value: this.nomineeForm.value.phone || '-' },
            ]
        }
    ]);

    submit() {
        this.loading.set(true);
        const p = this.selectedPolicy();
        const child = this.selectedChild();
        const start = new Date();
        const end = new Date(start.getTime() + p.durationYears * 365.25 * 24 * 3600 * 1000);
        const riskRes = this.riskResult();

        this.appApi.create({
            policyId: p.policyId,
            childId: child.childId,
            paymentFrequency: this.frequencyControl.value || 'MONTHLY',
            startDate: start,
            endDate: end,
            parentAge: this.parentAge() ?? undefined,
            occupation: this.occupation() || undefined,
            annualIncome: this.annualIncome() ?? undefined,
            coverageAmount: this.coverageAmount() ?? undefined,
        } as any).subscribe({
            next: (app) => {
                const appAny = app as any;
                const appId = appAny.data ? appAny.data.applicationId : (appAny.applicationId || appAny);

                this.nomineeApi.add({
                    nomineeName: this.nomineeForm.value.nomineeName!,
                    relationship: this.nomineeForm.value.relationship!,
                    phone: this.nomineeForm.value.phone!,
                    applicationId: appId,
                }).subscribe();

                const user = this.auth.currentUser();
                let uploadsCompleted = 0;

                if (this.requiredDocs().length === 0) {
                    this.loading.set(false);
                    this.toast.success('Application submitted! Awaiting underwriter review.');
                    this.router.navigate(['/applications/my-applications']);
                    return;
                }

                this.uploadedFiles().forEach((file, docType) => {
                    this.documentApi.uploadDocument(file, appId, null, docType, user?.userId || 1).subscribe({
                        next: () => {
                            uploadsCompleted++;
                            if (uploadsCompleted === this.requiredDocs().length) {
                                this.loading.set(false);
                                this.toast.success('Application submitted! Awaiting underwriter review.');
                                this.router.navigate(['/applications/my-applications']);
                            }
                        },
                        error: () => {
                            uploadsCompleted++;
                            if (uploadsCompleted === this.requiredDocs().length) {
                                this.loading.set(false);
                                this.toast.success('Application submitted but some documents failed.');
                                this.router.navigate(['/applications/my-applications']);
                            }
                        }
                    });
                });
            },
            error: err => {
                this.loading.set(false);
                this.toast.error(err.message || 'Failed to submit application');
            }
        });
    }
}
