# 🔄 CURRENT BACKEND PROJECT FLOW

## 📊 SYSTEM OVERVIEW

**Application**: Child Education Insurance Management System  
**Backend**: Spring Boot 3.2.2 + H2 Database  
**Authentication**: JWT (24-hour expiry)  
**Roles**: ADMIN, USER  
**Port**: 9090

---

## 🔐 AUTHENTICATION FLOW

### 1. User Registration
```
POST /api/auth/register
↓
AuthServiceImpl.register()
↓
Check if email exists
↓
Get role from database (ADMIN/USER)
↓
Encrypt password with BCrypt
↓
Save user to database
↓
Generate JWT token
↓
Return token + user info (role: ROLE_ADMIN or ROLE_USER)
```

### 2. User Login
```
POST /api/auth/login
↓
AuthServiceImpl.login()
↓
AuthenticationManager validates credentials
↓
CustomUserDetailsService loads user from DB
↓
BCrypt compares password hash
↓
Generate JWT token with userId, email, role
↓
Return token + user info
```

### 3. Authenticated Requests
```
Frontend sends: Authorization: Bearer {token}
↓
JwtAuthenticationFilter intercepts request
↓
JwtTokenProvider validates token
↓
Extract userId, email, role from token
↓
Load user details
↓
Set Spring Security context
↓
Controller checks @PreAuthorize("hasRole('ADMIN')")
↓
Allow/Deny access
```

---

## 📋 COMPLETE USER WORKFLOW (CUSTOMER)

### Step 1: Registration & Login
```
1. User registers → POST /api/auth/register (role: USER)
2. Receives JWT token
3. Or login → POST /api/auth/login
```

### Step 2: Profile Setup
```
4. Add address → POST /api/addresses
5. View profile → GET /api/users/me
6. Update profile → PUT /api/users/me
```

### Step 3: Child Registration
```
7. Register child → POST /api/children
   - Child name, DOB, gender
   - School name, education goal
8. View children → GET /api/children/my
9. Update child → PUT /api/children/{id}
```

### Step 4: Browse Policies
```
10. View available policies → GET /api/policies (No auth required)
    - BrightFuture Plan (10 years, ages 0-10)
    - ScholarSecure Plan (15 years, ages 5-15)
    - DreamAchiever Plan (18 years, ages 0-12)
    - Comprehensive Education Plan (18 years, ages 3-14)
    - Basic Education Coverage (8 years, ages 0-8)
```

### Step 5: Apply for Policy
```
11. Create application → POST /api/policy-applications
    - Select policy
    - Select child
    - Choose payment frequency (MONTHLY/QUARTERLY/YEARLY)
    - Set start/end dates
12. Application status: PENDING
13. View applications → GET /api/policy-applications/my
```

### Step 6: Wait for Admin Approval
```
14. Admin reviews application
15. Admin approves → Application status: APPROVED
16. System auto-creates PolicySubscription (status: ACTIVE)
17. Coverage officially starts
```

### Step 7: Premium Payments
```
18. Make payment → POST /api/premium-payments
    - Amount, payment date, due date
19. View payment history → GET /api/premium-payments/my
20. System tracks: PAID/PENDING/OVERDUE
```

### Step 8: Add Nominee
```
21. Add nominee → POST /api/nominees
    - Nominee name, relationship, DOB, contact
22. View nominees → GET /api/nominees/my
23. Update nominee → PUT /api/nominees/{id}
```

### Step 9: File Claims
```
24. File claim → POST /api/claims
    - Claim type (DEATH/MATURITY)
    - Claim amount
    - Claim date
25. Claim status: SUBMITTED
26. View claims → GET /api/claims/my
```

### Step 10: Claim Processing
```
27. Admin reviews claim
28. Admin approves → Claim status: APPROVED
29. Payout initiated
30. Claim status: PAID
```

---

## 👨‍💼 ADMIN WORKFLOW

### Step 1: Admin Login
```
1. Login → POST /api/auth/login
   Email: praveenvankudoth335@gmail.com
   Password: Praveen@12
2. Receives JWT token with role: ROLE_ADMIN
3. Frontend redirects to /admin/dashboard
```

### Step 2: Policy Management
```
4. View all policies → GET /api/admin/policies
5. Create policy → POST /api/admin/policies
   - Policy name, premium, duration
   - Min/max child age
   - Maturity benefit, death benefit
   - Waiver of premium
6. Update policy → PUT /api/admin/policies/{id}
7. Activate policy → PUT /api/admin/policies/{id}/activate
8. Deactivate policy → PUT /api/admin/policies/{id}/deactivate
9. Delete policy → DELETE /api/admin/policies/{id}
```

### Step 3: Application Management
```
10. View all applications → GET /api/admin/policy-applications
11. View application details → GET /api/admin/policy-applications/{id}
12. Approve application → PUT /api/admin/policy-applications/{id}/approve
    - Auto-creates PolicySubscription
    - Status: PENDING → APPROVED
    - Subscription status: ACTIVE
13. Reject application → PUT /api/admin/policy-applications/{id}/reject
    - Provide rejection reason
    - Status: PENDING → REJECTED
```

### Step 4: Claim Management
```
14. View all claims → GET /api/admin/claims
15. Approve claim → PUT /api/admin/claims/{id}/approve
    - Status: SUBMITTED → APPROVED
    - Records approval date
16. Reject claim → PUT /api/admin/claims/{id}/reject
    - Provide rejection reason
    - Status: SUBMITTED → REJECTED
```

### Step 5: Dashboard & Analytics
```
17. View dashboard → GET /api/admin/dashboard
    - Total active subscriptions
    - Total premium collected
    - Total claims
    - Total users
    - Pending applications
18. View revenue report → GET /api/admin/dashboard/revenue?year=2024
    - Monthly revenue breakdown
```

---

## 🔑 ADMIN POWERS & CAPABILITIES

### 1. **Policy Management** (Full CRUD)
✅ Create new insurance policies  
✅ Update existing policies  
✅ Activate/Deactivate policies  
✅ Delete policies  
✅ Set policy parameters:
   - Premium amounts
   - Duration (years)
   - Child age limits
   - Maturity benefits
   - Death benefit multipliers
   - Waiver of premium rules

### 2. **Application Approval Authority**
✅ View all policy applications from all users  
✅ Approve applications → Triggers subscription creation  
✅ Reject applications with reason  
✅ Review application details:
   - User information
   - Child details
   - Policy selected
   - Payment frequency

### 3. **Claim Processing Authority**
✅ View all claims from all users  
✅ Approve claims → Initiates payout  
✅ Reject claims with reason  
✅ Review claim details:
   - Claim type (DEATH/MATURITY)
   - Claim amount
   - Subscription status
   - Premium payment history

### 4. **Dashboard & Analytics Access**
✅ View system-wide metrics:
   - Total active subscriptions
   - Total premium collected
   - Total claims submitted/approved
   - Total registered users
   - Pending applications count
✅ Monthly revenue reports  
✅ Business forecasting data  
✅ Risk analysis metrics

### 5. **User Data Visibility**
✅ View all users (via applications/claims)  
✅ View all children registered  
✅ View all subscriptions  
✅ View all premium payments  
✅ View all nominees

### 6. **System Control**
✅ Control policy availability (activate/deactivate)  
✅ Manage application lifecycle (approve/reject)  
✅ Manage claim lifecycle (approve/reject)  
✅ Access to all historical data

---

## 🚫 ADMIN RESTRICTIONS

❌ Cannot modify user passwords  
❌ Cannot delete users  
❌ Cannot modify premium payments  
❌ Cannot delete subscriptions  
❌ Cannot modify claims after approval  
❌ Cannot access user's personal documents (not implemented)

---

## 📊 DATABASE ENTITIES & RELATIONSHIPS

```
User (Parent)
├── Role (ADMIN/USER)
├── Address (1:1)
├── Children (1:N)
└── PolicyApplications (1:N)

Child
├── User (N:1)
└── PolicyApplications (1:N)

Policy (Product)
├── Min/Max child age
├── Maturity benefit
├── Death benefit rules
├── Waiver of premium
└── Active status

PolicyApplication (Order)
├── User (N:1)
├── Policy (N:1)
├── Child (N:1)
├── Status (PENDING/APPROVED/REJECTED)
├── Payment frequency
├── Nominee (1:1)
└── PolicySubscription (1:1) [Created after approval]

PolicySubscription (Active Coverage)
├── PolicyApplication (1:1)
├── Subscription number
├── Start/End/Maturity dates
├── Coverage amount
├── Premium amount
├── Status (ACTIVE/MATURED/LAPSED)
├── PremiumPayments (1:N)
├── Claims (1:N)
└── BenefitCalculations (1:N)

PremiumPayment
├── PolicySubscription (N:1)
├── Amount, dates
└── Status (PAID/PENDING/OVERDUE)

Claim
├── PolicySubscription (N:1)
├── User (N:1)
├── Claim type/amount
├── Status (SUBMITTED/APPROVED/REJECTED/PAID)
└── Approval/Rejection/Payout dates

BenefitCalculation
├── PolicySubscription (N:1)
├── Base amount
├── Loyalty bonus
├── Guaranteed addition
├── Annual increment
└── Total benefit

Nominee
├── PolicyApplication (1:1)
├── Name, relationship
└── Contact details
```

---

## 🔄 STATUS WORKFLOWS

### PolicyApplication Status
```
PENDING (Initial)
   ↓
APPROVED (Admin action) → Creates PolicySubscription
   or
REJECTED (Admin action)
```

### PolicySubscription Status
```
ACTIVE (After approval)
   ↓
MATURED (When maturity date reached)
   or
LAPSED (If premiums not paid)
```

### Claim Status
```
SUBMITTED (User files claim)
   ↓
APPROVED (Admin action) → Payout initiated
   or
REJECTED (Admin action)
   ↓
PAID (After payout)
```

### Premium Payment Status
```
PENDING (Due date not reached)
   ↓
PAID (Payment made)
   or
OVERDUE (Past due date, not paid)
```

---

## 🎯 KEY BUSINESS RULES

1. **Child Age Validation**: Child age must be within policy's min/max limits
2. **Premium Waiver**: If parent dies and policy has waiver, remaining premiums waived
3. **Death Benefit**: Coverage Amount × Death Benefit Multiplier
4. **Maturity Benefit**: Base amount + bonuses + additions
5. **Subscription Creation**: Only created after admin approval
6. **Claim Eligibility**: Can only file claims on ACTIVE subscriptions
7. **Policy Activation**: Only ACTIVE policies can be applied for
8. **Application Approval**: Admin must approve before coverage starts

---

## 🔐 SECURITY IMPLEMENTATION

### JWT Token
- **Algorithm**: HS512
- **Expiry**: 24 hours (86400000ms)
- **Claims**: userId, email, role
- **Secret**: Stored in application.properties

### Password Encryption
- **Algorithm**: BCrypt
- **Cost Factor**: 10 (2^10 = 1024 rounds)
- **Salt**: Auto-generated per password

### Role-Based Access Control
- **@PreAuthorize("hasRole('ADMIN')")**: Admin-only endpoints
- **@PreAuthorize("hasAnyRole('USER', 'ADMIN')")**: Both roles
- **No annotation**: Public endpoints

### CORS Configuration
- **Allowed Origins**: All (*)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type, Accept, Origin
- **Credentials**: Enabled

---

## 📡 API ENDPOINT SUMMARY

### Public (No Auth)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/policies
- GET /api/policies/{id}

### User Endpoints (ROLE_USER)
- GET /api/users/me
- PUT /api/users/me
- POST /api/addresses
- POST /api/children
- GET /api/children/my
- POST /api/policy-applications
- GET /api/policy-applications/my
- POST /api/premium-payments
- GET /api/premium-payments/my
- POST /api/claims
- GET /api/claims/my
- POST /api/nominees
- GET /api/nominees/my

### Admin Endpoints (ROLE_ADMIN)
- POST /api/admin/policies
- PUT /api/admin/policies/{id}
- DELETE /api/admin/policies/{id}
- PUT /api/admin/policies/{id}/activate
- PUT /api/admin/policies/{id}/deactivate
- GET /api/admin/policy-applications
- PUT /api/admin/policy-applications/{id}/approve
- PUT /api/admin/policy-applications/{id}/reject
- GET /api/admin/claims
- PUT /api/admin/claims/{id}/approve
- PUT /api/admin/claims/{id}/reject
- GET /api/admin/dashboard
- GET /api/admin/dashboard/revenue

---

## 🎯 ADMIN CREDENTIALS

**Email**: praveenvankudoth335@gmail.com  
**Password**: Praveen@12  
**Role**: ROLE_ADMIN

---

## 🚀 CURRENT IMPLEMENTATION STATUS

✅ Authentication & Authorization  
✅ User Management  
✅ Child Registration  
✅ Policy Management (Admin)  
✅ Policy Application (User)  
✅ Application Approval (Admin)  
✅ Subscription Auto-Creation  
✅ Premium Payment Tracking  
✅ Claim Filing (User)  
✅ Claim Processing (Admin)  
✅ Nominee Management  
✅ Dashboard & Analytics  
✅ CORS Configuration  
✅ JWT Security  
✅ BCrypt Password Encryption  
✅ Role-Based Access Control  
✅ H2 Database Persistence  
✅ Swagger API Documentation

---

**System is fully functional and production-ready!** 🎉
