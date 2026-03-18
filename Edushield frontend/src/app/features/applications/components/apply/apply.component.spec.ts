import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ApplyComponent } from './apply.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ChildService } from '../../../children/services/child.service';
import { PolicyService } from '../../../policies/services/policy.service';
import { PolicyApplicationService } from '../../services/policy-application.service';
import { NomineeService } from '../../services/nominee.service';
import { DocumentService } from '../../../document/services/document.service';
import { RiskEstimatorService } from '../../services/risk-estimator.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ApplyComponent', () => {
    let component: ApplyComponent;
    let fixture: ComponentFixture<ApplyComponent>;

    let authSpy: jasmine.SpyObj<AuthService>;
    let childSpy: jasmine.SpyObj<ChildService>;
    let policySpy: jasmine.SpyObj<PolicyService>;
    let appSpy: jasmine.SpyObj<PolicyApplicationService>;
    let nomineeSpy: jasmine.SpyObj<NomineeService>;
    let documentSpy: jasmine.SpyObj<DocumentService>;
    let riskSpy: jasmine.SpyObj<RiskEstimatorService>;
    let toastSpy: jasmine.SpyObj<ToastService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockChild = { childId: 1, childName: 'Junior', dateOfBirth: new Date('2020-01-01'), schoolName: 'S', educationGoal: 'E' } as any;
    const mockPolicy = { policyId: 10, policyName: 'ScholarSecure Plus', basePremium: 1000, durationYears: 10, isActive: true, maturityBenefitAmount: 1000000 } as any;

    beforeEach(async () => {
        authSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
        childSpy = jasmine.createSpyObj('ChildService', ['getMyChildren']);
        policySpy = jasmine.createSpyObj('PolicyService', ['getAll']);
        appSpy = jasmine.createSpyObj('PolicyApplicationService', ['create']);
        nomineeSpy = jasmine.createSpyObj('NomineeService', ['add']);
        documentSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument']);
        riskSpy = jasmine.createSpyObj('RiskEstimatorService', ['getRiskCategoryColor', 'getMultiplierForCategory']);
        toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        childSpy.getMyChildren.and.returnValue(of({ data: [mockChild] }) as any);
        policySpy.getAll.and.returnValue(of({ data: [mockPolicy] }) as any);
        (riskSpy as any).OCCUPATIONS = ['Doctor'];

        await TestBed.configureTestingModule({
            imports: [ApplyComponent, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ChildService, useValue: childSpy },
                { provide: PolicyService, useValue: policySpy },
                { provide: PolicyApplicationService, useValue: appSpy },
                { provide: NomineeService, useValue: nomineeSpy },
                { provide: DocumentService, useValue: documentSpy },
                { provide: RiskEstimatorService, useValue: riskSpy },
                { provide: ToastService, useValue: toastSpy },
                { provide: Router, useValue: routerSpy },
                {
                    provide: ActivatedRoute,
                    useValue: { queryParams: of({ childId: '1', policyId: '10' }) }
                }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(ApplyComponent);
        component = fixture.componentInstance;
    });

    it('should create and load initial data', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.myChildren().length).toBe(1);
        expect(component.activePolicies().length).toBe(1);
    });

    it('should pre-select child and policy from query params', () => {
        fixture.detectChanges();
        expect(component.selectedChild()).toEqual(jasmine.objectContaining({ childId: 1 }));
        expect(component.selectedPolicy()).toEqual(jasmine.objectContaining({ policyId: 10 }));
        // Should have skipped to step 3 because both are pre-selected
        expect(component.currentStep()).toBe(3);
    });

    it('should handle step navigation', () => {
        fixture.detectChanges();
        component.currentStep.set(1);
        component.selectedChild.set(null);
        expect(component.canProceed()).toBeFalse();

        component.selectedChild.set(mockChild as any);
        expect(component.canProceed()).toBeTrue();
        component.nextStep();
        expect(component.currentStep()).toBe(2);
    });

    it('should validate risk form step', () => {
        fixture.detectChanges();
        component.currentStep.set(3);
        expect(component.riskFormValid()).toBeFalsy();

        component.parentAge.set(35);
        component.occupation.set('Doctor');
        component.annualIncome.set(1000000);
        component.coverageAmount.set(5000000);
        expect(component.riskFormValid()).toBeTrue();
    });

    it('should validate nominee form step', () => {
        fixture.detectChanges();
        component.currentStep.set(4);
        expect(component.nomineeFormValid()).toBeFalse();

        component.nomineeForm.patchValue({
            nomineeName: 'Jane Doe',
            relationship: 'MOTHER',
            phone: '9876543210'
        });
        expect(component.nomineeFormValid()).toBeTrue();
    });

    it('should submit application and upload documents', fakeAsync(() => {
        authSpy.currentUser.and.returnValue({ userId: 123 } as any);
        appSpy.create.and.returnValue(of({ applicationId: 500 }) as any);
        nomineeSpy.add.and.returnValue(of({}) as any);
        documentSpy.uploadDocument.and.returnValue(of({}) as any);

        fixture.detectChanges();
        component.selectedChild.set(mockChild as any);
        component.selectedPolicy.set(mockPolicy as any);
        component.parentAge.set(35);
        component.occupation.set('Doctor');
        component.annualIncome.set(1000000);
        component.coverageAmount.set(5000000);
        component.nomineeForm.patchValue({ nomineeName: 'Jane', relationship: 'Mother', phone: '9876543210' });
        
        // Mock a file for upload
        const mockFile = new File([''], 'test.pdf');
        component.requiredDocs.set([{ documentType: 'ID' }]);
        const fileMap = new Map();
        fileMap.set('ID', mockFile);
        component.uploadedFiles.set(fileMap);

        component.submit();
        tick();

        expect(appSpy.create).toHaveBeenCalled();
        expect(nomineeSpy.add).toHaveBeenCalled();
        expect(documentSpy.uploadDocument).toHaveBeenCalled();
        expect(toastSpy.success).toHaveBeenCalledWith('Application submitted! Awaiting underwriter review.');
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/applications/my-applications']);
    }));

    it('should handle submission error', () => {
        appSpy.create.and.returnValue(throwError(() => new Error('Server limit reached')));
        fixture.detectChanges();
        component.selectedPolicy.set(mockPolicy as any); // just enough to call submit
        
        component.submit();
        expect(toastSpy.error).toHaveBeenCalledWith('Server limit reached');
        expect(component.loading()).toBeFalse();
    });
});
