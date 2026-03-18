import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../auth/services/auth.service';
import { AdminDashboardService } from '../../admin/services/admin-dashboard.service';
import { PolicyApplicationService } from '../../applications/services/policy-application.service';
import { SubscriptionService } from '../../subscriptions/services/subscription.service';
import { PremiumPaymentService } from '../../payments/services/premium-payment.service';
import { ClaimService } from '../../claims/services/claim.service';
import { ChildService } from '../../children/services/child.service';
import { PolicyService } from '../../policies/services/policy.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { DatePipe } from '@angular/common';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let adminDashSpy: jasmine.SpyObj<AdminDashboardService>;
  let appSpy: jasmine.SpyObj<PolicyApplicationService>;
  let subSpy: jasmine.SpyObj<SubscriptionService>;
  let paymentSpy: jasmine.SpyObj<PremiumPaymentService>;
  let claimSpy: jasmine.SpyObj<ClaimService>;
  let childSpy: jasmine.SpyObj<ChildService>;
  let policySpy: jasmine.SpyObj<PolicyService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isAdmin', 'isUser', 'isUnderwriter', 'isClaimsOfficer', 'currentUser']);
    adminDashSpy = jasmine.createSpyObj('AdminDashboardService', ['getMetrics']);
    appSpy = jasmine.createSpyObj('PolicyApplicationService', ['getMyApplications']);
    subSpy = jasmine.createSpyObj('SubscriptionService', ['getMySubscriptions']);
    paymentSpy = jasmine.createSpyObj('PremiumPaymentService', ['getMyPayments']);
    claimSpy = jasmine.createSpyObj('ClaimService', ['getMyClaims']);
    childSpy = jasmine.createSpyObj('ChildService', ['getMyChildren']);
    policySpy = jasmine.createSpyObj('PolicyService', ['getAll']);

    // Default return values
    authServiceSpy.isAdmin.and.returnValue(false);
    authServiceSpy.isUser.and.returnValue(true);
    authServiceSpy.isUnderwriter.and.returnValue(false);
    authServiceSpy.isClaimsOfficer.and.returnValue(false);
    appSpy.getMyApplications.and.returnValue(of({ data: [] }) as any);
    subSpy.getMySubscriptions.and.returnValue(of({ data: [] }) as any);
    paymentSpy.getMyPayments.and.returnValue(of({ data: [] }) as any);
    claimSpy.getMyClaims.and.returnValue(of({ data: [] }) as any);
    childSpy.getMyChildren.and.returnValue(of({ data: [] }) as any);
    policySpy.getAll.and.returnValue(of({ data: [] }) as any);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule, DatePipe],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AdminDashboardService, useValue: adminDashSpy },
        { provide: PolicyApplicationService, useValue: appSpy },
        { provide: SubscriptionService, useValue: subSpy },
        { provide: PremiumPaymentService, useValue: paymentSpy },
        { provide: ClaimService, useValue: claimSpy },
        { provide: ChildService, useValue: childSpy },
        { provide: PolicyService, useValue: policySpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call admin metrics if user is admin', () => {
    authServiceSpy.isAdmin.and.returnValue(true);
    const mockMetrics = {
      totalPolicies: 10,
      activePolicies: 8,
      totalPremiumPaid: 500000,
      upcomingPayments: 3,
      totalChildren: 20,
      pendingClaims: 5,
      approvedClaims: 10,
      totalClaimAmount: 100000
    } as any;
    adminDashSpy.getMetrics.and.returnValue(of(mockMetrics));

    fixture.detectChanges();

    expect(adminDashSpy.getMetrics).toHaveBeenCalled();
    expect(component.metricsSignal()).toEqual(mockMetrics);
  });

  it('should build user metrics if user is NOT admin', () => {
    authServiceSpy.isAdmin.and.returnValue(false);
    
    childSpy.getMyChildren.and.returnValue(of({ data: [{}, {}] }) as any); // 2 children
    subSpy.getMySubscriptions.and.returnValue(of({ data: [{ status: 'ACTIVE' }, { status: 'LAPSED' }] }) as any); // 1 active
    paymentSpy.getMyPayments.and.returnValue(of({ data: [{ status: 'PAID', amount: 1000 }, { status: 'FAILED', amount: 500 }] }) as any); // 1000 paid
    claimSpy.getMyClaims.and.returnValue(of({ data: [{ status: 'APPROVED', claimAmount: 5000 }, { status: 'SUBMITTED', claimAmount: 2000 }] }) as any); // 1 approved, 1 pending
    policySpy.getAll.and.returnValue(of({ data: [{}, {}, {}] }) as any); // 3 policies in catalog

    fixture.detectChanges();

    const metrics = component.metricsSignal();
    expect(metrics).toBeTruthy();
    expect(metrics?.totalChildren).toBe(2);
    expect(metrics?.activePolicies).toBe(1);
    expect(metrics?.totalPremiumPaid).toBe(1000);
    expect(metrics?.approvedClaims).toBe(1);
    expect(metrics?.pendingClaims).toBe(1);
    expect(metrics?.totalPolicies).toBe(3);
  });

  it('should return correct badge class for status', () => {
    expect(component.getStatusBadge('ACTIVE')).toBe('badge-success');
    expect(component.getStatusBadge('PENDING')).toBe('badge-warning');
    expect(component.getStatusBadge('REJECTED')).toBe('badge-danger');
    expect(component.getStatusBadge('UNKNOWN')).toBe('badge-gray');
  });

  it('should map metrics to metricCards computed signal', () => {
    const mockMetrics = {
        activePolicies: 5,
        totalPremiumPaid: 100000,
        totalChildren: 3,
        upcomingPayments: 2,
        pendingClaims: 1,
        approvedClaims: 1,
        totalClaimAmount: 50000,
        totalPolicies: 10
    } as any;
    component.metricsSignal.set(mockMetrics);

    const cards = component.metricCards();
    expect(cards.length).toBe(8);
    expect(cards.find(c => c.label === 'Active Policies')?.value).toBe('5');
    expect(cards.find(c => c.label === 'Premium Paid')?.value).toBe('₹100K');
  });
});
