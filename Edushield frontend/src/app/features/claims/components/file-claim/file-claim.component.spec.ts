import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FileClaimComponent } from './file-claim.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { ClaimService } from '../../services/claim.service';
import { SubscriptionService } from '../../../subscriptions/services/subscription.service';
import { DocumentService } from '../../../document/services/document.service';
import { ToastService } from '../../../../core/services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('FileClaimComponent', () => {
    let component: FileClaimComponent;
    let fixture: ComponentFixture<FileClaimComponent>;

    let authSpy: jasmine.SpyObj<AuthService>;
    let claimSpy: jasmine.SpyObj<ClaimService>;
    let subSpy: jasmine.SpyObj<SubscriptionService>;
    let documentSpy: jasmine.SpyObj<DocumentService>;
    let toastSpy: jasmine.SpyObj<ToastService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const mockSub = { 
        subscriptionId: 101, 
        status: 'ACTIVE', 
        policyName: 'ScholarSecure Plus',
        coverageAmount: 500000 
    } as any;

    beforeEach(async () => {
        authSpy = jasmine.createSpyObj('AuthService', ['currentUser']);
        claimSpy = jasmine.createSpyObj('ClaimService', ['fileClaim']);
        subSpy = jasmine.createSpyObj('SubscriptionService', ['getMySubscriptions']);
        documentSpy = jasmine.createSpyObj('DocumentService', ['uploadDocument', 'getRequirements']);
        toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        subSpy.getMySubscriptions.and.returnValue(of({ data: [mockSub] }) as any);

        await TestBed.configureTestingModule({
            imports: [FileClaimComponent, RouterTestingModule, ReactiveFormsModule],
            providers: [
                { provide: AuthService, useValue: authSpy },
                { provide: ClaimService, useValue: claimSpy },
                { provide: SubscriptionService, useValue: subSpy },
                { provide: DocumentService, useValue: documentSpy },
                { provide: ToastService, useValue: toastSpy },
                { provide: Router, useValue: routerSpy },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(FileClaimComponent);
        component = fixture.componentInstance;
    });

    it('should create and load active subscriptions', () => {
        fixture.detectChanges();
        expect(component).toBeTruthy();
        expect(component.subscriptions().length).toBe(1);
    });

    it('should update max claim amount when subscription and type are selected', () => {
        fixture.detectChanges();
        component.form.patchValue({
            subscriptionId: '101' as any,
            claimType: 'MATURITY'
        });
        
        expect(component.maxClaimAmount()).toBe(500000);
        const amountCtrl = component.form.get('claimAmount');
        amountCtrl?.setValue(600000 as any);
        expect(amountCtrl?.errors?.['max']).toBeTruthy();
    });

    it('should handle MATURITY score requirements', () => {
        fixture.detectChanges();
        component.form.get('claimType')?.setValue('MATURITY' as any);
        const scoreCtrl = component.form.get('scoreSecured');
        
        scoreCtrl?.setValue(80 as any);
        expect(scoreCtrl?.valid).toBeFalsy();
        
        scoreCtrl?.setValue(90 as any);
        expect(scoreCtrl?.valid).toBeTruthy();
    });

    it('should handle PARTIAL_WITHDRAWAL reason requirement', () => {
        fixture.detectChanges();
        component.form.get('claimType')?.setValue('PARTIAL_WITHDRAWAL' as any);
        const reasonCtrl = component.form.get('reason');
        
        expect(reasonCtrl?.valid).toBeFalsy();
        reasonCtrl?.setValue('Emergency' as any);
        expect(reasonCtrl?.valid).toBeTruthy();
    });

    it('should set requirements based on policy name', () => {
        fixture.detectChanges();
        component.form.patchValue({ subscriptionId: '101' as any });
        // ScholarSecure Plus contains 'ScholarSecure'
        expect(component.requiredDocs().length).toBeGreaterThan(0);
        expect(component.requiredDocs().find(d => d.documentType === 'Student ID')).toBeTruthy();
    });

    it('should file claim and upload documents', fakeAsync(() => {
        authSpy.currentUser.and.returnValue({ userId: 123 } as any);
        claimSpy.fileClaim.and.returnValue(of({ applicationId: 999 }) as any); // actually claimId
        documentSpy.uploadDocument.and.returnValue(of({}));

        fixture.detectChanges();
        component.form.patchValue({
            subscriptionId: '101' as any,
            claimType: 'MATURITY',
            claimAmount: 400000 as any,
            scoreSecured: 95
        });
        
        const mockFile = new File([''], 'id.pdf');
        component.requiredDocs.set([{ documentType: 'Marks Sheet' }]);
        const fileMap = new Map();
        fileMap.set('Marks Sheet', mockFile);
        component.uploadedFiles.set(fileMap);

        component.onSubmit();
        tick();

        expect(claimSpy.fileClaim).toHaveBeenCalled();
        expect(documentSpy.uploadDocument).toHaveBeenCalled();
        expect(component.submitted()).toBeTrue();
    }));

    it('should handle file claim error', () => {
        claimSpy.fileClaim.and.returnValue(throwError(() => new Error('Already filed')));
        fixture.detectChanges();
        component.form.patchValue({ subscriptionId: '101' as any, claimType: 'DEATH', claimAmount: 100 as any });
        
        component.onSubmit();
        expect(toastSpy.error).toHaveBeenCalledWith('Already filed');
        expect(component.loading()).toBeFalse();
    });
});
