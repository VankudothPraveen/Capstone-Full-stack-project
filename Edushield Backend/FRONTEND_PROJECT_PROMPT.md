# Child Education Insurance - Frontend Development Prompt

## Project Overview
Build a standalone Angular 21 frontend application for a Child Education Insurance Management System with Tailwind CSS styling. This is a STANDALONE frontend project with NO backend integration - all data should be mocked/hardcoded for UI demonstration purposes.

## Technology Stack
- **Framework**: Angular 21 (Latest)
- **Styling**: Tailwind CSS
- **State Management**: Angular Signals / RxJS
- **Routing**: Angular Router
- **Forms**: Reactive Forms
- **HTTP Client**: Angular HttpClient (for mock data only)
- **Icons**: Heroicons or Lucide Angular
- **Charts**: Chart.js with ng2-charts (for dashboard)

## Color Palette (Hartford-Inspired)
```css
Primary Maroon: #8A0F3D
Deep Maroon: #6E0830
Light Maroon: #A52A5A
Accent Gold: #D4AF37
Background Gray: #F5F5F5
Dark Gray: #333333
Medium Gray: #666666
Light Gray: #E0E0E0
White: #FFFFFF
Success Green: #10B981
Warning Yellow: #F59E0B
Error Red: #EF4444
Info Blue: #3B82F6
```

## Design Requirements
- Modern, professional, and eye-catching UI
- Responsive design (mobile-first approach)
- Smooth animations and transitions
- Glassmorphism effects for cards
- Gradient backgrounds using maroon shades
- Professional typography (Inter or Poppins font)
- Consistent spacing and padding
- Accessible (WCAG 2.1 AA compliant)

## Application Structure

### 1. Authentication Module
**Components:**
- Login Page
- Registration Page
- Forgot Password Page

**User Entity Attributes:**
```typescript
interface User {
  userId: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  createdAt: Date;
  roleId: number;
  roleName: string; // 'ROLE_USER' or 'ROLE_ADMIN'
}
```

**Address Entity Attributes:**
```typescript
interface Address {
  addressId: number;
  street: string;
  city: string;
  state: string;
  pincode: string;
  userId: number;
}
```

### 2. User Dashboard Module
**Components:**
- Dashboard Overview
- Profile Management
- Address Management

**Dashboard Metrics:**
```typescript
interface DashboardMetrics {
  totalPolicies: number;
  activePolicies: number;
  totalPremiumPaid: number;
  upcomingPayments: number;
  totalChildren: number;
  pendingClaims: number;
  approvedClaims: number;
  totalClaimAmount: number;
}
```

### 3. Child Management Module
**Components:**
- Child List
- Add Child Form
- Edit Child Form
- Child Details View

**Child Entity Attributes:**
```typescript
interface Child {
  childId: number;
  childName: string;
  dateOfBirth: Date;
  gender: string; // 'MALE', 'FEMALE', 'OTHER'
  schoolName: string;
  educationGoal: string;
  userId: number;
}
```

### 4. Policy Module
**Components:**
- Policy Catalog/List
- Policy Details View
- Policy Comparison Tool
- Policy Calculator

**Policy Entity Attributes:**
```typescript
interface Policy {
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
```

### 5. Policy Application Module
**Components:**
- Apply for Policy Form (Multi-step)
- Application List
- Application Details
- Application Status Tracker

**Policy Application Entity Attributes:**
```typescript
interface PolicyApplication {
  applicationId: number;
  policyNumber: string;
  startDate: Date;
  endDate: Date;
  status: string; // 'PENDING', 'APPROVED', 'REJECTED', 'ACTIVE'
  paymentFrequency: string; // 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY'
  applicationDate: Date;
  approvalDate: Date | null;
  rejectionReason: string | null;
  totalPaidAmount: number;
  userId: number;
  policyId: number;
  childId: number;
  policyName: string;
  childName: string;
}
```

**Nominee Entity Attributes:**
```typescript
interface Nominee {
  nomineeId: number;
  nomineeName: string;
  relationship: string;
  phone: string;
  applicationId: number;
}
```

### 6. Policy Subscription Module
**Components:**
- My Subscriptions List
- Subscription Details
- Subscription Timeline

**Policy Subscription Entity Attributes:**
```typescript
interface PolicySubscription {
  subscriptionId: number;
  subscriptionNumber: string;
  startDate: Date;
  endDate: Date;
  maturityDate: Date;
  coverageAmount: number;
  premiumAmount: number;
  status: string; // 'ACTIVE', 'MATURED', 'LAPSED', 'CANCELLED'
  totalPaidAmount: number;
  applicationId: number;
  policyName: string;
  childName: string;
}
```

### 7. Premium Payment Module
**Components:**
- Payment History
- Make Payment Form
- Payment Receipt
- Upcoming Payments

**Premium Payment Entity Attributes:**
```typescript
interface PremiumPayment {
  paymentId: number;
  amount: number;
  paymentDate: Date;
  dueDate: Date;
  lateFee: number;
  status: string; // 'PAID', 'PENDING', 'OVERDUE', 'FAILED'
  subscriptionId: number;
  applicationId: number;
  subscriptionNumber: string;
  policyName: string;
}
```

### 8. Claims Module
**Components:**
- File Claim Form
- Claims List
- Claim Details
- Claim Status Tracker

**Claim Entity Attributes:**
```typescript
interface Claim {
  claimId: number;
  claimType: string; // 'MATURITY', 'DEATH', 'PARTIAL_WITHDRAWAL'
  claimDate: Date;
  claimAmount: number;
  status: string; // 'PENDING', 'APPROVED', 'REJECTED', 'PAID'
  approvalDate: Date | null;
  rejectionReason: string | null;
  payoutDate: Date | null;
  subscriptionId: number;
  userId: number;
  subscriptionNumber: string;
  policyName: string;
}
```

### 9. Benefit Calculation Module
**Components:**
- Benefit Calculator
- Benefit Breakdown View
- Maturity Projection

**Benefit Calculation Entity Attributes:**
```typescript
interface BenefitCalculation {
  calculationId: number;
  calculationDate: Date;
  baseAmount: number;
  loyaltyBonus: number;
  guaranteedAddition: number;
  annualIncrement: number;
  totalBenefit: number;
  benefitType: string; // 'MATURITY', 'DEATH', 'SURRENDER'
  subscriptionId: number;
}
```

### 10. Admin Module
**Components:**
- Admin Dashboard
- User Management
- Policy Management (CRUD)
- Application Approval/Rejection
- Claim Approval/Rejection
- Reports and Analytics

**Monthly Revenue Report:**
```typescript
interface MonthlyRevenueReport {
  month: string;
  year: number;
  totalRevenue: number;
  totalPayments: number;
  totalClaims: number;
  netRevenue: number;
}
```

## Shared Components
1. **Navigation Bar** - Responsive navbar with user menu
2. **Sidebar** - Collapsible sidebar for navigation
3. **Footer** - Company info and links
4. **Loading Spinner** - Maroon-themed loader
5. **Alert/Toast Notifications** - Success, error, warning messages
6. **Confirmation Modal** - For delete/critical actions
7. **Data Table** - Reusable table with sorting, filtering, pagination
8. **Card Component** - Glassmorphism styled cards
9. **Form Input Components** - Styled form controls
10. **Breadcrumb** - Navigation breadcrumb
11. **Status Badge** - Color-coded status indicators
12. **Empty State** - For no data scenarios
13. **Error Page** - 404, 500 error pages

## Routing Structure
```
/
├── /auth
│   ├── /login
│   ├── /register
│   └── /forgot-password
├── /dashboard (User)
├── /profile
├── /address
├── /children
│   ├── /list
│   ├── /add
│   └── /:id/edit
├── /policies
│   ├── /catalog
│   ├── /:id/details
│   └── /compare
├── /applications
│   ├── /apply
│   ├── /my-applications
│   └── /:id/details
├── /subscriptions
│   ├── /my-subscriptions
│   └── /:id/details
├── /payments
│   ├── /history
│   ├── /make-payment
│   └── /upcoming
├── /claims
│   ├── /file-claim
│   ├── /my-claims
│   └── /:id/details
├── /benefits
│   └── /calculator
└── /admin
    ├── /dashboard
    ├── /users
    ├── /policies
    ├── /applications
    ├── /claims
    └── /reports
```

## Key Features to Implement

### 1. Authentication & Authorization
- JWT token storage (mock)
- Role-based access control (USER, ADMIN)
- Route guards for protected routes
- Auto-logout on token expiry

### 2. Form Validations
- Email format validation
- Phone number validation (10 digits)
- Date validations (DOB, policy dates)
- Password strength validation
- Custom validators for business rules

### 3. Data Tables
- Sorting (ascending/descending)
- Filtering/Search
- Pagination
- Export to CSV/PDF
- Column visibility toggle

### 4. Charts & Visualizations
- Premium payment trends (Line chart)
- Policy distribution (Pie chart)
- Monthly revenue (Bar chart)
- Claim status breakdown (Doughnut chart)

### 5. Animations
- Page transitions
- Card hover effects
- Button ripple effects
- Skeleton loaders
- Smooth scrolling

### 6. Responsive Design Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Mock Data Requirements
Create comprehensive mock data for:
- 5-10 sample policies
- 3-5 users with different roles
- 5-10 children
- 10-15 policy applications
- 10-15 subscriptions
- 20-30 premium payments
- 5-10 claims
- Dashboard metrics
- Monthly revenue reports

## Styling Guidelines

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'primary-maroon': '#8A0F3D',
        'deep-maroon': '#6E0830',
        'light-maroon': '#A52A5A',
        'accent-gold': '#D4AF37',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
}
```

### Component Styling Examples

**Button Styles:**
- Primary: Maroon background with white text
- Secondary: White background with maroon border
- Danger: Red background
- Success: Green background

**Card Styles:**
- White background with subtle shadow
- Glassmorphism effect for featured cards
- Hover effects with scale transform

**Form Styles:**
- Maroon focus ring
- Rounded corners
- Proper spacing and labels
- Error states in red

## Performance Optimization
- Lazy loading for modules
- OnPush change detection strategy
- Virtual scrolling for large lists
- Image optimization
- Code splitting

## Accessibility Requirements
- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Color contrast compliance

## Testing Requirements
- Unit tests for components
- Service tests
- Form validation tests
- Route guard tests

## Deliverables
1. Complete Angular 21 project structure
2. All components with mock data
3. Responsive UI with Tailwind CSS
4. Working navigation and routing
5. Form validations
6. Data tables with sorting/filtering
7. Charts and visualizations
8. Admin and user dashboards
9. README with setup instructions
10. Mock data services

## Important Notes
- **NO BACKEND INTEGRATION** - All data must be mocked
- Focus on UI/UX excellence
- Ensure all entity attributes are used in the UI
- Create realistic mock data
- Implement proper error handling
- Add loading states for all async operations
- Use Angular best practices
- Follow DRY principles
- Maintain consistent code style
- Add comments for complex logic

## Success Criteria
- Professional, eye-catching design
- Fully responsive across all devices
- Smooth animations and transitions
- All CRUD operations working with mock data
- Role-based access control implemented
- All forms with proper validation
- Data tables with full functionality
- Charts displaying mock data
- No console errors
- Fast load times
- Accessible to all users

---

**Build a production-ready, visually stunning Angular 21 application that showcases the complete Child Education Insurance Management System with Hartford-inspired maroon color scheme and modern UI/UX design patterns.**
