# Child Education Insurance - Complete Workflow Guide

## System Architecture Overview

This system implements a complete child education insurance workflow with clear separation between:
- **Policy Order (PolicyApplication)**: Customer's application for insurance
- **Policy Subscription**: Active insurance coverage created after approval
- **Benefit Calculation**: Tracking of bonuses and maturity benefits

## System Actors

1. **ADMIN** - Manages policies, approves applications, handles claims
2. **USER (Customer/Parent)** - Registers children, applies for policies, pays premiums, files claims

---

## Complete Workflow Steps

### STEP 1: User Registration & Login ✅

**Customer Registration**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "SecurePass123",
  "phone": "9876543210",
  "role": "USER"
}
```

**Response**: JWT token for authentication

**Admin Registration**
```http
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "AdminPass123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```

---

### STEP 2: Policy Product Creation (Admin) ✅

**Admin Creates Policy Products**

```http
POST /api/admin/policies
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "policyName": "BrightFuture Plan",
  "basePremium": 5000.00,
  "durationYears": 10,
  "bonusPercentage": 15.50,
  "riskCoverageAmount": 1000000.00,
  "minChildAge": 0,
  "maxChildAge": 10,
  "maturityBenefitAmount": 500000.00,
  "deathBenefitMultiplier": 2.0,
  "waiverOfPremium": true,
  "isActive": true,
  "description": "Comprehensive education plan for school-going children"
}
```

**Policy Configuration Includes:**
- Min/Max child entry age
- Policy duration (10/15/18 years)
- Base premium amount
- Maturity benefit amount
- Death benefit multiplier (e.g., 2x coverage)
- Waiver of premium on parent death
- Active/Inactive status

**Pre-seeded Policies:**
1. BrightFuture Plan (10 years, ages 0-10)
2. ScholarSecure Plan (15 years, ages 5-15)
3. DreamAchiever Plan (18 years, ages 0-12)
4. Comprehensive Education Plan (18 years, ages 3-14)
5. Basic Education Coverage (8 years, ages 0-8)

---

### STEP 3: Child Registration ✅

**Parent Registers Child**

```http
POST /api/children
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "childName": "Aarav Kumar",
  "dateOfBirth": "2018-05-15",
  "gender": "Male",
  "schoolName": "Delhi Public School",
  "educationGoal": "Engineering"
}
```

**Child Details Include:**
- Name, DOB, Gender
- School name
- Education goal (School/UG/PG/Professional)

---

### STEP 4: Policy Order Creation ✅

**Parent Creates Policy Application (Order)**

```http
POST /api/policy-applications
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "policyId": 1,
  "childId": 1,
  "paymentFrequency": "MONTHLY",
  "startDate": "2024-01-01",
  "endDate": "2034-01-01"
}
```

**Payment Frequency Options:**
- MONTHLY
- QUARTERLY
- YEARLY

**System Creates:**
- PolicyApplication with status = PENDING
- Unique policy number generated
- Application date recorded

**At This Stage:**
- ❌ No insurance coverage yet
- ❌ No premium payments required
- ⏳ Waiting for admin approval

---

### STEP 5: Order Approval/Rejection (Admin) ✅

**Admin Reviews Application**

```http
GET /api/admin/policy-applications
Authorization: Bearer {admin_token}
```

**Admin Checks:**
- Child age eligibility (within min/max age)
- Parent details completeness
- Policy availability

**Approve Application:**
```http
PUT /api/admin/policy-applications/{applicationId}/approve
Authorization: Bearer {admin_token}
```

**Reject Application:**
```http
PUT /api/admin/policy-applications/{applicationId}/reject
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "rejectionReason": "Child age exceeds policy limit"
}
```

**On Approval:**
- Application status → APPROVED
- Approval date recorded
- ➡️ **Automatically triggers PolicySubscription creation**
- PolicySubscription created with:
  - Unique subscription number (SUB-{timestamp})
  - Start/End dates from application
  - Maturity date = Start date + Policy duration
  - Coverage amount = Policy risk coverage
  - Premium amount = Policy base premium
  - Status = ACTIVE
  - Total paid amount = 0.00

**On Rejection:**
- Application status → REJECTED
- Rejection reason stored
- ❌ No subscription created

---

### STEP 6: Subscription Creation ✅

**Automatic After Approval**

When admin approves application, system **automatically** creates:

**PolicySubscription Entity:**
```
- Subscription Number: SUB-{timestamp}
- Start Date: From application
- End Date: From application
- Maturity Date: Start Date + Policy Duration
- Coverage Amount: Policy risk coverage
- Premium Amount: Based on frequency
- Status: ACTIVE
- Total Paid Amount: 0.00
```

**Implementation:**
- PolicyApplicationServiceImpl.approveApplication() automatically calls createSubscriptionForApprovedApplication()
- Subscription is created in the same transaction as approval
- No manual intervention required

**Now:**
- ✅ Child education coverage officially starts
- ✅ Premium payments become due
- ✅ Claims can be filed
- ✅ Benefits start accumulating

---

### STEP 7: Premium Payment Tracking ✅

**Customer Makes Premium Payment**

```http
POST /api/premium-payments
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "subscriptionId": 1,
  "amount": 5000.00,
  "paymentDate": "2024-01-15",
  "dueDate": "2024-01-10"
}
```

**System Tracks:**
- Payment date
- Amount paid
- Due date
- Late fees (if applicable)
- Payment status (PAID/PENDING/OVERDUE)

**Premium Payment Rules:**
- Monthly: Due every month
- Quarterly: Due every 3 months
- Yearly: Due annually

**If Parent Dies During Policy:**
- ✅ Remaining premiums waived (if waiverOfPremium = true)
- ✅ Full maturity benefit guaranteed
- ✅ Subscription continues until maturity

---

### STEP 8: Bonus/Benefit Calculation ✅

**System Calculates Benefits**

Benefits are calculated periodically (annually) and stored:

```
BenefitCalculation:
- Base Amount: Maturity benefit amount
- Loyalty Bonus: Based on years active
- Guaranteed Addition: Policy bonus percentage
- Annual Increment: Yearly growth
- Total Benefit: Sum of all components
```

**Example Calculation:**
```
Base Maturity Benefit: ₹5,00,000
Loyalty Bonus (5 years): ₹25,000
Guaranteed Addition (15.5%): ₹77,500
Annual Increment: ₹10,000
-----------------------------------
Total Benefit: ₹6,12,500
```

**View Benefits:**
```http
GET /api/subscriptions/{subscriptionId}/benefits
Authorization: Bearer {user_token}
```

---

### STEP 9: Admin Dashboard & Analytics ✅

**Admin Dashboard Metrics**

```http
GET /api/admin/dashboard
Authorization: Bearer {admin_token}
```

**Metrics Include:**
- Total Active Subscriptions
- Total Premium Collected
- Upcoming Maturities
- Lapsed Policies
- Pending Applications
- Claim Statistics
- Revenue Trends

**Monthly Revenue Report:**
```http
GET /api/admin/dashboard/revenue?year=2024
Authorization: Bearer {admin_token}
```

---

### STEP 10: Claim Process ✅

**Customer Files Claim**

**Death Claim (Parent Dies):**
```http
POST /api/claims
Authorization: Bearer {user_token}
Content-Type: application/json

{
  "subscriptionId": 1,
  "claimType": "DEATH",
  "claimAmount": 1000000.00,
  "claimDate": "2024-06-15"
}
```

**Maturity Claim:**
```http
POST /api/claims
{
  "subscriptionId": 1,
  "claimType": "MATURITY",
  "claimAmount": 612500.00,
  "claimDate": "2034-01-01"
}
```

**Claim Status:** SUBMITTED

**Admin Reviews Claim:**
```http
GET /api/admin/claims
Authorization: Bearer {admin_token}
```

**Admin Checks:**
- Death certificate (for death claims)
- Policy validity
- Premium payment history
- Subscription status

**Approve Claim:**
```http
PUT /api/admin/claims/{claimId}/approve
Authorization: Bearer {admin_token}
```

**Reject Claim:**
```http
PUT /api/admin/claims/{claimId}/reject
Authorization: Bearer {admin_token}
```

**Claim Lifecycle:**
```
SUBMITTED → APPROVED → PAID
     or
SUBMITTED → REJECTED
```

**On Approval:**
- Claim status → APPROVED
- Approval date recorded
- Payout initiated
- Payout date recorded

---

### STEP 11: Policy Maturity ✅

**When Child Reaches Maturity Age**

System automatically:
1. **Daily Scheduler** runs at midnight (SchedulerConfig)
2. Checks all ACTIVE subscriptions
3. Compares maturity date with current date
4. Updates subscription status → MATURED
5. Calculates final benefit
6. Marks policy as COMPLETED

**Manual Trigger (Admin):**
```http
POST /api/subscriptions/process-maturity
Authorization: Bearer {admin_token}
```

**Implementation:**
- Scheduled task runs daily at 00:00:00
- PolicySubscriptionService.processMaturedSubscriptions() processes all matured policies
- Automatic status update from ACTIVE to MATURED

**Maturity Benefit Includes:**
- Base maturity amount
- All accumulated bonuses
- Loyalty additions
- Guaranteed additions

**Money Used For:**
- 🎓 School fees
- 🎓 College admission
- 🎓 Higher education
- 🎓 Professional courses

---

### STEP 12: Renewal/Upgrade ✅

**Customer Can:**

**Renew Policy:**
```http
POST /api/policy-applications
{
  "policyId": 1,
  "childId": 1,
  "paymentFrequency": "YEARLY",
  "startDate": "2034-01-01",
  "endDate": "2044-01-01"
}
```

**Upgrade Coverage:**
```http
POST /api/policy-applications
{
  "policyId": 2,
  "childId": 1,
  "paymentFrequency": "MONTHLY",
  "startDate": "2024-06-01",
  "endDate": "2039-06-01"
}
```

New application → New approval cycle → New subscription

---

## Entity Relationships

```
User (Parent)
  ├── Children (1:N)
  ├── PolicyApplications (1:N)
  └── Address (1:1)

Child
  └── PolicyApplications (1:N)

Policy (Product)
  └── PolicyApplications (1:N)

PolicyApplication (Order)
  ├── User (N:1)
  ├── Policy (N:1)
  ├── Child (N:1)
  ├── Nominee (1:1)
  └── PolicySubscription (1:1) [Created after approval]

PolicySubscription (Active Coverage)
  ├── PolicyApplication (1:1)
  ├── PremiumPayments (1:N)
  ├── Claims (1:N)
  └── BenefitCalculations (1:N)

PremiumPayment
  └── PolicySubscription (N:1)

Claim
  ├── PolicySubscription (N:1)
  └── User (N:1)

BenefitCalculation
  └── PolicySubscription (N:1)
```

---

## Status Workflows

### PolicyApplication Status
```
PENDING → APPROVED → [Subscription Created]
   ↓
REJECTED
```

### PolicySubscription Status
```
ACTIVE → MATURED
   ↓
LAPSED (if premiums not paid)
```

### Claim Status
```
SUBMITTED → APPROVED → PAID
      ↓
   REJECTED
```

### Premium Payment Status
```
PENDING → PAID
   ↓
OVERDUE (if past due date)
```

---

## Key Business Rules

1. **Child Age Validation**: Child age must be within policy's min/max age limits
2. **Premium Waiver**: If parent dies and waiverOfPremium=true, remaining premiums waived
3. **Death Benefit**: Death benefit = Coverage Amount × Death Benefit Multiplier
4. **Maturity Benefit**: Calculated with bonuses and additions
5. **Late Fees**: Applied if payment made after due date
6. **Policy Activation**: Only ACTIVE policies can be applied for
7. **Subscription Creation**: Only created after admin approval
8. **Claim Eligibility**: Can only file claims on ACTIVE subscriptions
9. **Maturity Processing**: Automatic when maturity date reached

---

## API Endpoints Summary

### Authentication
- POST /api/auth/register
- POST /api/auth/login

### User Management
- GET /api/users/me
- PUT /api/users/me

### Children
- POST /api/children
- GET /api/children/my
- GET /api/children/{id}
- PUT /api/children/{id}
- DELETE /api/children/{id}

### Policies (Public)
- GET /api/policies
- GET /api/policies/{id}

### Policy Applications (Orders)
- POST /api/policy-applications
- GET /api/policy-applications/my
- GET /api/policy-applications/{id}

### Policy Subscriptions
- GET /api/subscriptions/my
- GET /api/subscriptions/{id}
- GET /api/subscriptions/{id}/benefits

### Premium Payments
- POST /api/premium-payments
- GET /api/premium-payments/my
- GET /api/premium-payments/{id}

### Claims
- POST /api/claims
- GET /api/claims/my
- GET /api/claims/{id}

### Admin - Policies
- POST /api/admin/policies
- PUT /api/admin/policies/{id}
- DELETE /api/admin/policies/{id}
- PUT /api/admin/policies/{id}/activate
- PUT /api/admin/policies/{id}/deactivate

### Admin - Applications
- GET /api/admin/policy-applications
- PUT /api/admin/policy-applications/{id}/approve
- PUT /api/admin/policy-applications/{id}/reject

### Admin - Subscriptions
- GET /api/subscriptions
- GET /api/subscriptions/{id}
- POST /api/subscriptions/process-maturity

### User - Subscriptions
- GET /api/subscriptions/my
- GET /api/subscriptions/{id}

### Admin - Claims
- GET /api/admin/claims
- PUT /api/admin/claims/{id}/approve
- PUT /api/admin/claims/{id}/reject

### Admin - Dashboard
- GET /api/admin/dashboard
- GET /api/admin/dashboard/revenue

---

## Testing Workflow

1. Register ADMIN user
2. Register USER (parent)
3. Admin creates policy products
4. User registers child
5. User creates policy application
6. Admin approves application (subscription created)
7. User makes premium payments
8. System calculates benefits
9. User files claim (if needed)
10. Admin processes claim
11. Policy reaches maturity

---

## Database Schema

All entities are automatically created via JPA with proper relationships and constraints.

**Key Tables:**
- users
- roles
- children
- policy (products)
- policy_application (orders)
- policy_subscription (active coverage)
- premium_payment
- claim
- benefit_calculation
- nominee
- address

---

## Next Steps for Implementation

✅ **ALL CRITICAL FEATURES IMPLEMENTED:**

1. ✅ Service layer implementations - COMPLETE
2. ✅ Controller methods - COMPLETE
3. ✅ Subscription creation logic on approval - IMPLEMENTED
4. ✅ Benefit calculation structure - COMPLETE
5. ✅ Maturity processing scheduler - IMPLEMENTED
6. ✅ Status workflow corrections - FIXED

**System is now 100% workflow compliant!**

---

**System Status**: Fully Operational ✅
**Workflow Alignment**: 100% ✅
