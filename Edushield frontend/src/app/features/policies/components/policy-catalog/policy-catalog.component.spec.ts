import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PolicyCatalogComponent } from './policy-catalog.component';
import { PolicyService } from '../../services/policy.service';
import { of, throwError } from 'rxjs';
import { Policy } from '../../../../core/models/interfaces';
import { ActivatedRoute } from '@angular/router';

describe('PolicyCatalogComponent', () => {
  let component: PolicyCatalogComponent;
  let fixture: ComponentFixture<PolicyCatalogComponent>;
  let policyServiceSpy: jasmine.SpyObj<PolicyService>;

  const mockPolicies: Policy[] = [
    { policyId: 1, policyName: 'Short Term No Waiver', durationYears: 10, basePremium: 3000, waiverOfPremium: false } as Policy,
    { policyId: 2, policyName: 'Long Term Waiver Budget', durationYears: 15, basePremium: 2000, waiverOfPremium: true } as Policy,
    { policyId: 3, policyName: 'Budget Short Term', durationYears: 5, basePremium: 1000, waiverOfPremium: false } as Policy,
  ];

  beforeEach(async () => {
    policyServiceSpy = jasmine.createSpyObj('PolicyService', ['getAll']);
    policyServiceSpy.getAll.and.returnValue(of({ data: mockPolicies } as any));

    await TestBed.configureTestingModule({
      imports: [PolicyCatalogComponent],
      providers: [
        { provide: PolicyService, useValue: policyServiceSpy },
        { provide: ActivatedRoute, useValue: {} } 
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyCatalogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fetch policies on load', () => {
    fixture.detectChanges();
    expect(policyServiceSpy.getAll).toHaveBeenCalledWith(0, 100);
    expect(component.allPolicies().length).toBe(3);
  });

  it('should handle error when fetching policies', () => {
    policyServiceSpy.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.allPolicies().length).toBe(0);
  });

  it('should filter correctly: All', () => {
    fixture.detectChanges();
    component.activeFilter.set('All');
    expect(component.filteredPolicies().length).toBe(3);
  });

  it('should filter correctly: Short Term (< 12yr)', () => {
    fixture.detectChanges();
    component.activeFilter.set('Short Term (< 12yr)');
    expect(component.filteredPolicies().length).toBe(2);
    expect(component.filteredPolicies()[0].policyName).toContain('Short Term');
  });

  it('should filter correctly: Long Term (≥ 12yr)', () => {
    fixture.detectChanges();
    component.activeFilter.set('Long Term (≥ 12yr)');
    expect(component.filteredPolicies().length).toBe(1);
    expect(component.filteredPolicies()[0].policyName).toContain('Long Term');
  });

  it('should filter correctly: With Waiver', () => {
    fixture.detectChanges();
    component.activeFilter.set('With Waiver');
    expect(component.filteredPolicies().length).toBe(1);
    expect(component.filteredPolicies()[0].waiverOfPremium).toBeTrue();
  });

  it('should filter correctly: Budget', () => {
    fixture.detectChanges();
    component.activeFilter.set('Budget');
    expect(component.filteredPolicies().length).toBe(2);
    expect(component.filteredPolicies()[1].basePremium).toBeLessThanOrEqual(2500);
  });
});
