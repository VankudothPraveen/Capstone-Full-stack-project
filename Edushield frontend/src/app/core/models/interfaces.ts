export interface User {
    userId: number;
    name: string;
    email: string;
    password?: string;
    phone: string;
    createdAt?: Date;
    roleId?: number;
    role?: string; // Backend returns: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_UNDERWRITER' | 'ROLE_CLAIMS_OFFICER' | 'ROLE_CUSTOMER'
    roleName?: string; // Alias for compatibility
    active?: boolean;
    isActive?: boolean;
    provider?: string;
    imageUrl?: string;
}

export interface Address {
    addressId: number;
    street: string;
    city: string;
    state: string;
    pincode: string;
    userId: number;
}

export interface Child {
    childId: number;
    childName: string;
    dateOfBirth: Date;
    gender: string; // 'MALE' | 'FEMALE' | 'OTHER'
    schoolName: string;
    educationGoal: string;
    userId: number;
}

export interface Policy {
    policyId: number;
    policyName: string;
    basePremium: number;
    durationYears: number;
    bonusPercentage: number;
    riskCoverageAmount: number;
    minChildAge: number;
    maxChildAge: number;
    maturityBenefitAmount: number;
    deathBenefitMultiplier: number;
    waiverOfPremium: boolean;
    isActive: boolean;
    description: string;
}

export interface PolicyApplication {
    applicationId: number;
    policyNumber: string;
    startDate: Date;
    endDate: Date;
    status: string; // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ACTIVE'
    paymentFrequency: string; // 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY'
    applicationDate: Date;
    approvalDate: Date | null;
    rejectionReason: string | null;
    totalPaidAmount: number;
    userId: number;
    userName?: string;
    policyId: number;
    childId: number;
    policyName: string;
    childName: string;
    riskScore?: number;
    riskCategory?: string;
    calculatedPremium?: number;
    basePremium?: number;
}

export interface Nominee {
    nomineeId: number;
    nomineeName: string;
    relationship: string;
    phone: string;
    applicationId: number;
}

export interface PolicySubscription {
    subscriptionId: number;
    subscriptionNumber: string;
    startDate: Date;
    endDate: Date;
    maturityDate: Date;
    coverageAmount: number;
    premiumAmount: number;
    status: string; // 'ACTIVE' | 'MATURED' | 'LAPSED' | 'CANCELLED'
    totalPaidAmount: number;
    applicationId: number;
    policyName: string;
    childName: string;
}

export interface PremiumPayment {
    paymentId: number;
    amount: number;
    paymentDate: Date;
    dueDate: Date;
    lateFee: number;
    status: string; // 'PAID' | 'PENDING' | 'OVERDUE' | 'FAILED'
    subscriptionId: number;
    applicationId: number;
    subscriptionNumber: string;
    policyName: string;
}

export interface Claim {
    claimId: number;
    claimType: string; // 'MATURITY' | 'DEATH' | 'PARTIAL_WITHDRAWAL'
    claimDate: Date;
    claimAmount: number;
    status: string; // 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'PAID'
    approvalDate: Date | null;
    rejectionReason: string | null; // kept for template compatibility
    reason: string | null;          // backend field name (ClaimResponse.reason)
    payoutDate: Date | null;
    subscriptionId: number;
    applicationId: number;
    userId: number;
    subscriptionNumber: string;
    policyName: string;
    policyNumber: string;
}

export interface BenefitCalculation {
    calculationId: number;
    calculationDate: Date;
    baseAmount: number;
    loyaltyBonus: number;
    guaranteedAddition: number;
    annualIncrement: number;
    totalBenefit: number;
    benefitType: string; // 'MATURITY' | 'DEATH' | 'SURRENDER'
    subscriptionId: number;
}

export interface MonthlyRevenueReport {
    month: string;
    year: number;
    totalRevenue: number;
    totalPayments: number;
    totalClaims: number;
    netRevenue: number;
}

export interface DashboardMetrics {
    totalPolicies: number;
    activePolicies: number;
    totalPremiumPaid: number;
    upcomingPayments: number;
    totalChildren: number;
    pendingClaims: number;
    approvedClaims: number;
    totalClaimAmount: number;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}
