import { Injectable } from '@angular/core';
import {
    User, Address, Child, Policy, PolicyApplication, Nominee,
    PolicySubscription, PremiumPayment, Claim, BenefitCalculation,
    MonthlyRevenueReport, DashboardMetrics
} from '../models/interfaces';

@Injectable({ providedIn: 'root' })
export class MockDataService {

    users: User[] = [
        { userId: 1, name: 'Priya Sharma', email: 'user@demo.com', password: 'User@123', phone: '9876543210', createdAt: new Date('2023-01-15'), roleId: 2, roleName: 'ROLE_USER' },
        { userId: 2, name: 'Admin Kumar', email: 'admin@demo.com', password: 'Admin@123', phone: '9123456780', createdAt: new Date('2023-01-01'), roleId: 1, roleName: 'ROLE_ADMIN' },
        { userId: 3, name: 'Rahul Verma', email: 'rahul@demo.com', password: 'Rahul@123', phone: '9988776655', createdAt: new Date('2023-03-10'), roleId: 2, roleName: 'ROLE_USER' },
        { userId: 4, name: 'Sneha Patel', email: 'sneha@demo.com', password: 'Sneha@123', phone: '9876512345', createdAt: new Date('2023-05-20'), roleId: 2, roleName: 'ROLE_USER' },
        { userId: 5, name: 'Arjun Mehta', email: 'arjun@demo.com', password: 'Arjun@123', phone: '8765432109', createdAt: new Date('2023-07-01'), roleId: 2, roleName: 'ROLE_USER' },
    ];

    addresses: Address[] = [
        { addressId: 1, street: '123 MG Road', city: 'Bangalore', state: 'Karnataka', pincode: '560001', userId: 1 },
        { addressId: 2, street: '456 Park Street', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', userId: 3 },
        { addressId: 3, street: '789 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002', userId: 4 },
        { addressId: 4, street: '321 Civil Lines', city: 'Delhi', state: 'Delhi', pincode: '110001', userId: 5 },
    ];

    children: Child[] = [
        { childId: 1, childName: 'Aanya Sharma', dateOfBirth: new Date('2015-04-12'), gender: 'FEMALE', schoolName: 'Delhi Public School', educationGoal: 'Engineering', userId: 1 },
        { childId: 2, childName: 'Rohan Sharma', dateOfBirth: new Date('2018-09-23'), gender: 'MALE', schoolName: 'Kendriya Vidyalaya', educationGoal: 'Medicine', userId: 1 },
        { childId: 3, childName: 'Tanya Verma', dateOfBirth: new Date('2014-01-05'), gender: 'FEMALE', schoolName: 'Ryan International', educationGoal: 'Law', userId: 3 },
        { childId: 4, childName: 'Aryan Patel', dateOfBirth: new Date('2016-07-18'), gender: 'MALE', schoolName: 'DPS Pune', educationGoal: 'Architecture', userId: 4 },
        { childId: 5, childName: 'Ishaan Mehta', dateOfBirth: new Date('2013-11-30'), gender: 'MALE', schoolName: 'Amity School', educationGoal: 'MBA', userId: 5 },
        { childId: 6, childName: 'Nisha Mehta', dateOfBirth: new Date('2017-03-14'), gender: 'FEMALE', schoolName: 'St. Mary\'s', educationGoal: 'Arts', userId: 5 },
    ];

    policies: Policy[] = [
        {
            policyId: 1, policyName: 'EduShield Premium', basePremium: 5000, durationYears: 15,
            bonusPercentage: 12, riskCoverageAmount: 2500000, minChildAge: 0, maxChildAge: 10,
            maturityBenefitAmount: 1500000, deathBenefitMultiplier: 3, waiverOfPremium: true,
            isActive: true, description: 'Comprehensive child education policy with premium waiver and high death benefit. Perfect choice for long-term education planning.'
        },
        {
            policyId: 2, policyName: 'FutureStar Gold', basePremium: 3500, durationYears: 12,
            bonusPercentage: 10, riskCoverageAmount: 2500000, minChildAge: 1, maxChildAge: 8,
            maturityBenefitAmount: 1000000, deathBenefitMultiplier: 2.5, waiverOfPremium: true,
            isActive: true, description: 'Gold tier plan for securing your child\'s educational future with added bonuses and guaranteed additions.'
        },
        {
            policyId: 3, policyName: 'BrightPath Silver', basePremium: 2000, durationYears: 10,
            bonusPercentage: 8, riskCoverageAmount: 2500000, minChildAge: 2, maxChildAge: 12,
            maturityBenefitAmount: 750000, deathBenefitMultiplier: 2, waiverOfPremium: false,
            isActive: true, description: 'Affordable silver plan providing solid education funding with moderate risk coverage.'
        },
        {
            policyId: 4, policyName: 'SmartKid Platinum', basePremium: 8000, durationYears: 18,
            bonusPercentage: 15, riskCoverageAmount: 2500000, minChildAge: 0, maxChildAge: 7,
            maturityBenefitAmount: 2500000, deathBenefitMultiplier: 4, waiverOfPremium: true,
            isActive: true, description: 'Ultra-premium plan with highest coverage and maximum maturity benefits for discerning parents.'
        },
        {
            policyId: 5, policyName: 'AcademyGuard Basic', basePremium: 1200, durationYears: 8,
            bonusPercentage: 6, riskCoverageAmount: 2500000, minChildAge: 5, maxChildAge: 14,
            maturityBenefitAmount: 500000, deathBenefitMultiplier: 1.5, waiverOfPremium: false,
            isActive: true, description: 'Budget-friendly entry-level plan covering basic education needs with essential risk protection.'
        },
        {
            policyId: 6, policyName: 'EduCare Plus', basePremium: 4500, durationYears: 14,
            bonusPercentage: 11, riskCoverageAmount: 2500000, minChildAge: 1, maxChildAge: 9,
            maturityBenefitAmount: 1250000, deathBenefitMultiplier: 2.8, waiverOfPremium: true,
            isActive: true, description: 'Well-rounded policy combining education funding, life protection, and investment growth for your child.'
        },
        {
            policyId: 7, policyName: 'ScholarShield Legacy', basePremium: 6500, durationYears: 20,
            bonusPercentage: 14, riskCoverageAmount: 2500000, minChildAge: 0, maxChildAge: 6,
            maturityBenefitAmount: 2000000, deathBenefitMultiplier: 3.5, waiverOfPremium: true,
            isActive: false, description: 'Legacy plan for parents who want generational wealth transfer alongside education security.'
        },
    ];

    applications: PolicyApplication[] = [
        { applicationId: 1, policyNumber: 'POL-2023-001', startDate: new Date('2023-02-01'), endDate: new Date('2038-02-01'), status: 'ACTIVE', paymentFrequency: 'MONTHLY', applicationDate: new Date('2023-01-25'), approvalDate: new Date('2023-01-28'), rejectionReason: null, totalPaidAmount: 180000, userId: 1, policyId: 1, childId: 1, policyName: 'EduShield Premium', childName: 'Aanya Sharma' },
        { applicationId: 2, policyNumber: 'POL-2023-002', startDate: new Date('2023-06-01'), endDate: new Date('2035-06-01'), status: 'ACTIVE', paymentFrequency: 'QUARTERLY', applicationDate: new Date('2023-05-20'), approvalDate: new Date('2023-05-25'), rejectionReason: null, totalPaidAmount: 84000, userId: 1, policyId: 2, childId: 2, policyName: 'FutureStar Gold', childName: 'Rohan Sharma' },
        { applicationId: 3, policyNumber: 'POL-2023-003', startDate: new Date('2023-08-15'), endDate: new Date('2033-08-15'), status: 'PENDING', paymentFrequency: 'MONTHLY', applicationDate: new Date('2023-08-10'), approvalDate: null, rejectionReason: null, totalPaidAmount: 0, userId: 3, policyId: 3, childId: 3, policyName: 'BrightPath Silver', childName: 'Tanya Verma' },
        { applicationId: 4, policyNumber: 'POL-2023-004', startDate: new Date('2023-09-01'), endDate: new Date('2041-09-01'), status: 'ACTIVE', paymentFrequency: 'YEARLY', applicationDate: new Date('2023-08-25'), approvalDate: new Date('2023-08-28'), rejectionReason: null, totalPaidAmount: 96000, userId: 4, policyId: 4, childId: 4, policyName: 'SmartKid Platinum', childName: 'Aryan Patel' },
        { applicationId: 5, policyNumber: 'POL-2023-005', startDate: new Date('2023-10-01'), endDate: new Date('2031-10-01'), status: 'REJECTED', paymentFrequency: 'MONTHLY', applicationDate: new Date('2023-09-28'), approvalDate: null, rejectionReason: 'Child age exceeds policy maximum age limit', totalPaidAmount: 0, userId: 5, policyId: 5, childId: 5, policyName: 'AcademyGuard Basic', childName: 'Ishaan Mehta' },
        { applicationId: 6, policyNumber: 'POL-2024-006', startDate: new Date('2024-01-15'), endDate: new Date('2038-01-15'), status: 'ACTIVE', paymentFrequency: 'HALF_YEARLY', applicationDate: new Date('2024-01-10'), approvalDate: new Date('2024-01-12'), rejectionReason: null, totalPaidAmount: 108000, userId: 5, policyId: 6, childId: 6, policyName: 'EduCare Plus', childName: 'Nisha Mehta' },
    ];

    nominees: Nominee[] = [
        { nomineeId: 1, nomineeName: 'Suresh Sharma', relationship: 'Father', phone: '9876543211', applicationId: 1 },
        { nomineeId: 2, nomineeName: 'Meena Sharma', relationship: 'Mother', phone: '9876512340', applicationId: 2 },
        { nomineeId: 3, nomineeName: 'Ravi Verma', relationship: 'Father', phone: '9988776644', applicationId: 3 },
        { nomineeId: 4, nomineeName: 'Kavita Patel', relationship: 'Mother', phone: '9876543299', applicationId: 4 },
        { nomineeId: 5, nomineeName: 'Sanjay Mehta', relationship: 'Father', phone: '8765432101', applicationId: 6 },
    ];

    subscriptions: PolicySubscription[] = [
        { subscriptionId: 1, subscriptionNumber: 'SUB-2023-0001', startDate: new Date('2023-02-01'), endDate: new Date('2038-02-01'), maturityDate: new Date('2038-02-01'), coverageAmount: 1500000, premiumAmount: 5000, status: 'ACTIVE', totalPaidAmount: 180000, applicationId: 1, policyName: 'EduShield Premium', childName: 'Aanya Sharma' },
        { subscriptionId: 2, subscriptionNumber: 'SUB-2023-0002', startDate: new Date('2023-06-01'), endDate: new Date('2035-06-01'), maturityDate: new Date('2035-06-01'), coverageAmount: 1000000, premiumAmount: 3500, status: 'ACTIVE', totalPaidAmount: 84000, applicationId: 2, policyName: 'FutureStar Gold', childName: 'Rohan Sharma' },
        { subscriptionId: 3, subscriptionNumber: 'SUB-2023-0003', startDate: new Date('2023-09-01'), endDate: new Date('2041-09-01'), maturityDate: new Date('2041-09-01'), coverageAmount: 2500000, premiumAmount: 8000, status: 'ACTIVE', totalPaidAmount: 96000, applicationId: 4, policyName: 'SmartKid Platinum', childName: 'Aryan Patel' },
        { subscriptionId: 4, subscriptionNumber: 'SUB-2024-0004', startDate: new Date('2024-01-15'), endDate: new Date('2038-01-15'), maturityDate: new Date('2038-01-15'), coverageAmount: 1200000, premiumAmount: 4500, status: 'ACTIVE', totalPaidAmount: 108000, applicationId: 6, policyName: 'EduCare Plus', childName: 'Nisha Mehta' },
    ];

    payments: PremiumPayment[] = [
        { paymentId: 1, amount: 5000, paymentDate: new Date('2023-02-01'), dueDate: new Date('2023-02-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 2, amount: 5000, paymentDate: new Date('2023-03-01'), dueDate: new Date('2023-03-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 3, amount: 5000, paymentDate: new Date('2023-04-01'), dueDate: new Date('2023-04-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 4, amount: 5000, paymentDate: new Date('2023-05-05'), dueDate: new Date('2023-05-01'), lateFee: 250, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 5, amount: 5000, paymentDate: new Date('2023-06-01'), dueDate: new Date('2023-06-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 6, amount: 10500, paymentDate: new Date('2023-06-01'), dueDate: new Date('2023-06-01'), lateFee: 0, status: 'PAID', subscriptionId: 2, applicationId: 2, subscriptionNumber: 'SUB-2023-0002', policyName: 'FutureStar Gold' },
        { paymentId: 7, amount: 10500, paymentDate: new Date('2023-09-01'), dueDate: new Date('2023-09-01'), lateFee: 0, status: 'PAID', subscriptionId: 2, applicationId: 2, subscriptionNumber: 'SUB-2023-0002', policyName: 'FutureStar Gold' },
        { paymentId: 8, amount: 10500, paymentDate: new Date('2023-12-01'), dueDate: new Date('2023-12-01'), lateFee: 0, status: 'PAID', subscriptionId: 2, applicationId: 2, subscriptionNumber: 'SUB-2023-0002', policyName: 'FutureStar Gold' },
        { paymentId: 9, amount: 8000, paymentDate: new Date('2023-10-01'), dueDate: new Date('2023-10-01'), lateFee: 0, status: 'PAID', subscriptionId: 3, applicationId: 4, subscriptionNumber: 'SUB-2023-0003', policyName: 'SmartKid Platinum' },
        { paymentId: 10, amount: 0, paymentDate: new Date(), dueDate: new Date('2026-03-01'), lateFee: 0, status: 'PENDING', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 11, amount: 0, paymentDate: new Date(), dueDate: new Date('2026-03-05'), lateFee: 0, status: 'PENDING', subscriptionId: 3, applicationId: 4, subscriptionNumber: 'SUB-2023-0003', policyName: 'SmartKid Platinum' },
        { paymentId: 12, amount: 5000, paymentDate: new Date('2026-01-01'), dueDate: new Date('2026-01-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 13, amount: 5000, paymentDate: new Date('2026-02-01'), dueDate: new Date('2026-02-01'), lateFee: 0, status: 'PAID', subscriptionId: 1, applicationId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium' },
        { paymentId: 14, amount: 0, paymentDate: new Date(), dueDate: new Date('2026-02-15'), lateFee: 200, status: 'OVERDUE', subscriptionId: 2, applicationId: 2, subscriptionNumber: 'SUB-2023-0002', policyName: 'FutureStar Gold' },
    ];

    claims: Claim[] = [
        { claimId: 1, claimType: 'PARTIAL_WITHDRAWAL', claimDate: new Date('2024-06-01'), claimAmount: 50000, status: 'APPROVED', approvalDate: new Date('2024-06-10'), rejectionReason: null, reason: null, payoutDate: new Date('2024-06-12'), subscriptionId: 1, userId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium', applicationId: 1, policyNumber: 'POL-2023-0001' },
        { claimId: 2, claimType: 'PARTIAL_WITHDRAWAL', claimDate: new Date('2025-01-15'), claimAmount: 30000, status: 'PENDING', approvalDate: null, rejectionReason: null, reason: null, payoutDate: null, subscriptionId: 2, userId: 1, subscriptionNumber: 'SUB-2023-0002', policyName: 'FutureStar Gold', applicationId: 2, policyNumber: 'POL-2023-0002' },
        { claimId: 3, claimType: 'MATURITY', claimDate: new Date('2025-06-01'), claimAmount: 800000, status: 'PAID', approvalDate: new Date('2025-06-05'), rejectionReason: null, reason: null, payoutDate: new Date('2025-06-08'), subscriptionId: 3, userId: 4, subscriptionNumber: 'SUB-2023-0003', policyName: 'SmartKid Platinum', applicationId: 3, policyNumber: 'POL-2023-0003' },
        { claimId: 4, claimType: 'DEATH', claimDate: new Date('2025-09-20'), claimAmount: 1500000, status: 'REJECTED', approvalDate: null, rejectionReason: 'Policy lapsed due to non-payment', reason: 'Policy lapsed due to non-payment', payoutDate: null, subscriptionId: 4, userId: 5, subscriptionNumber: 'SUB-2024-0004', policyName: 'EduCare Plus', applicationId: 4, policyNumber: 'POL-2024-0004' },
        { claimId: 5, claimType: 'PARTIAL_WITHDRAWAL', claimDate: new Date('2026-01-10'), claimAmount: 75000, status: 'PENDING', approvalDate: null, rejectionReason: null, reason: null, payoutDate: null, subscriptionId: 1, userId: 1, subscriptionNumber: 'SUB-2023-0001', policyName: 'EduShield Premium', applicationId: 1, policyNumber: 'POL-2023-0001' },
    ];

    benefitCalculations: BenefitCalculation[] = [
        { calculationId: 1, calculationDate: new Date('2024-01-01'), baseAmount: 1500000, loyaltyBonus: 120000, guaranteedAddition: 80000, annualIncrement: 25000, totalBenefit: 1725000, benefitType: 'MATURITY', subscriptionId: 1 },
        { calculationId: 2, calculationDate: new Date('2024-01-01'), baseAmount: 4500000, loyaltyBonus: 0, guaranteedAddition: 0, annualIncrement: 0, totalBenefit: 4500000, benefitType: 'DEATH', subscriptionId: 1 },
        { calculationId: 3, calculationDate: new Date('2024-01-01'), baseAmount: 1000000, loyaltyBonus: 80000, guaranteedAddition: 50000, annualIncrement: 18000, totalBenefit: 1148000, benefitType: 'MATURITY', subscriptionId: 2 },
    ];

    monthlyRevenue: MonthlyRevenueReport[] = [
        { month: 'Jul', year: 2025, totalRevenue: 650000, totalPayments: 120, totalClaims: 3, netRevenue: 620000 },
        { month: 'Aug', year: 2025, totalRevenue: 720000, totalPayments: 135, totalClaims: 5, netRevenue: 690000 },
        { month: 'Sep', year: 2025, totalRevenue: 580000, totalPayments: 110, totalClaims: 2, netRevenue: 560000 },
        { month: 'Oct', year: 2025, totalRevenue: 890000, totalPayments: 165, totalClaims: 7, netRevenue: 850000 },
        { month: 'Nov', year: 2025, totalRevenue: 760000, totalPayments: 140, totalClaims: 4, netRevenue: 730000 },
        { month: 'Dec', year: 2025, totalRevenue: 920000, totalPayments: 180, totalClaims: 6, netRevenue: 875000 },
        { month: 'Jan', year: 2026, totalRevenue: 840000, totalPayments: 155, totalClaims: 8, netRevenue: 790000 },
        { month: 'Feb', year: 2026, totalRevenue: 980000, totalPayments: 195, totalClaims: 5, netRevenue: 945000 },
    ];

    getDashboardMetrics(userId: number): DashboardMetrics {
        const userApps = this.applications.filter(a => a.userId === userId);
        const userSubs = this.subscriptions.filter(s => userApps.some(a => a.applicationId === s.applicationId));
        const userClaims = this.claims.filter(c => c.userId === userId);
        const userPayments = this.payments.filter(p => userApps.some(a => a.applicationId === p.applicationId));
        const userChildren = this.children.filter(c => c.userId === userId);
        const upcomingPayments = userPayments.filter(p => p.status === 'PENDING' || p.status === 'OVERDUE');

        return {
            totalPolicies: this.policies.filter(p => p.isActive).length,
            activePolicies: userApps.filter(a => a.status === 'ACTIVE').length,
            totalPremiumPaid: userPayments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
            upcomingPayments: upcomingPayments.length,
            totalChildren: userChildren.length,
            pendingClaims: userClaims.filter(c => c.status === 'PENDING').length,
            approvedClaims: userClaims.filter(c => c.status === 'APPROVED' || c.status === 'PAID').length,
            totalClaimAmount: userClaims.filter(c => c.status === 'PAID').reduce((sum, c) => sum + c.claimAmount, 0),
        };
    }

    getAdminMetrics() {
        return {
            totalUsers: this.users.filter(u => u.roleName === 'ROLE_USER').length,
            totalApplications: this.applications.length,
            pendingApplications: this.applications.filter(a => a.status === 'PENDING').length,
            activeSubscriptions: this.subscriptions.filter(s => s.status === 'ACTIVE').length,
            totalRevenue: this.payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0),
            pendingClaims: this.claims.filter(c => c.status === 'PENDING').length,
            totalPolicies: this.policies.length,
            totalClaims: this.claims.length,
        };
    }
}
