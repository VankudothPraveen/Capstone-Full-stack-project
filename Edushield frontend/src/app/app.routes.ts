import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard, underwriterGuard, claimsOfficerGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    // Public Homepage
    {
        path: 'home',
        loadComponent: () => import('./features/home/components/home-page/home-page.component').then(m => m.HomePageComponent),
    },

    // Auth
    {
        path: 'auth',
        canActivate: [guestGuard],
        children: [
            { path: 'login', loadComponent: () => import('./features/auth/components/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('./features/auth/components/register/register.component').then(m => m.RegisterComponent) },
            { path: 'forgot-password', loadComponent: () => import('./features/auth/components/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent) },
        ]
    },

    // User Routes (protected)
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./layout/layout.component').then(m => m.LayoutComponent),
        children: [
            { path: 'dashboard', loadComponent: () => import('./features/dashboard/components/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'profile', loadComponent: () => import('./features/profile/components/profile.component').then(m => m.ProfileComponent) },
            { path: 'address', loadComponent: () => import('./features/profile/components/address/address.component').then(m => m.AddressComponent) },

            // Children
            { path: 'children/list', loadComponent: () => import('./features/children/components/child-list/child-list.component').then(m => m.ChildListComponent) },
            { path: 'children/add', loadComponent: () => import('./features/children/components/child-form/child-form.component').then(m => m.ChildFormComponent) },
            { path: 'children/:id/edit', loadComponent: () => import('./features/children/components/child-form/child-form.component').then(m => m.ChildFormComponent) },

            // Policies
            { path: 'policies/catalog', loadComponent: () => import('./features/policies/components/policy-catalog/policy-catalog.component').then(m => m.PolicyCatalogComponent) },
            { path: 'policies/:id/details', loadComponent: () => import('./features/policies/components/policy-details/policy-details.component').then(m => m.PolicyDetailsComponent) },
            { path: 'policies/compare', loadComponent: () => import('./features/policies/components/policy-compare/policy-compare.component').then(m => m.PolicyCompareComponent) },
            { path: 'policies/calculator', loadComponent: () => import('./features/policies/components/policy-calculator/policy-calculator.component').then(m => m.PolicyCalculatorComponent) },

            // Applications
            { path: 'applications/apply', loadComponent: () => import('./features/applications/components/apply/apply.component').then(m => m.ApplyComponent) },
            { path: 'applications/my-applications', loadComponent: () => import('./features/applications/components/application-list/application-list.component').then(m => m.ApplicationListComponent) },
            { path: 'applications/:id/details', loadComponent: () => import('./features/applications/components/application-details/application-details.component').then(m => m.ApplicationDetailsComponent) },

            // Subscriptions
            { path: 'subscriptions/my-subscriptions', loadComponent: () => import('./features/subscriptions/components/subscription-list/subscription-list.component').then(m => m.SubscriptionListComponent) },
            { path: 'subscriptions/:id/details', loadComponent: () => import('./features/subscriptions/components/subscription-details/subscription-details.component').then(m => m.SubscriptionDetailsComponent) },

            // Payments
            { path: 'payments/history', loadComponent: () => import('./features/payments/components/payment-history/payment-history.component').then(m => m.PaymentHistoryComponent) },
            { path: 'payments/make-payment', loadComponent: () => import('./features/payments/components/make-payment/make-payment.component').then(m => m.MakePaymentComponent) },
            { path: 'payments/upcoming', loadComponent: () => import('./features/payments/components/upcoming-payments/upcoming-payments.component').then(m => m.UpcomingPaymentsComponent) },

            // Claims
            { path: 'claims/file-claim', loadComponent: () => import('./features/claims/components/file-claim/file-claim.component').then(m => m.FileClaimComponent) },
            { path: 'claims/my-claims', loadComponent: () => import('./features/claims/components/claim-list/claim-list.component').then(m => m.ClaimListComponent) },
            { path: 'claims/:id/details', loadComponent: () => import('./features/claims/components/claim-details/claim-details.component').then(m => m.ClaimDetailsComponent) },

            // Benefits
            { path: 'benefits/calculator', loadComponent: () => import('./features/benefits/components/benefit-calculator/benefit-calculator.component').then(m => m.BenefitCalculatorComponent) },

            // Admin
            { path: 'admin/dashboard', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
            { path: 'admin/analytics', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent) },
            { path: 'admin/users', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/user-management/user-management.component').then(m => m.UserManagementComponent) },
            { path: 'admin/staff', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/staff-management/staff-management.component').then(m => m.StaffManagementComponent) },
            { path: 'admin/policies', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/policy-management/policy-management.component').then(m => m.PolicyManagementComponent) },
            { path: 'admin/applications', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/application-management/application-management.component').then(m => m.ApplicationManagementComponent) },
            { path: 'admin/claims', loadComponent: () => import('./features/admin/components/claim-management/claim-management.component').then(m => m.ClaimManagementComponent) },
            { path: 'admin/reports', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/reports/reports.component').then(m => m.ReportsComponent) },
            { path: 'admin/audit-logs', canActivate: [adminGuard], loadComponent: () => import('./features/admin/components/audit-logs/audit-logs.component').then(m => m.AuditLogsComponent) },

            // Underwriter
            { path: 'underwriter/dashboard', canActivate: [underwriterGuard], loadComponent: () => import('./features/admin/components/underwriter-dashboard/underwriter-dashboard.component').then(m => m.UnderwriterDashboardComponent) },
            { path: 'underwriter/applications', canActivate: [underwriterGuard], loadComponent: () => import('./features/admin/components/application-management/application-management.component').then(m => m.ApplicationManagementComponent) },

            // Claims Officer
            { path: 'claims/dashboard', canActivate: [claimsOfficerGuard], loadComponent: () => import('./features/admin/components/claims-officer-dashboard/claims-officer-dashboard.component').then(m => m.ClaimsOfficerDashboardComponent) },
            { path: 'claims-officer/claims', canActivate: [claimsOfficerGuard], loadComponent: () => import('./features/admin/components/claim-management/claim-management.component').then(m => m.ClaimManagementComponent) },
        ]
    },

    // 404
    { path: '**', redirectTo: 'home' }
];
