# 🚀 COMPLETE API ENDPOINTS - PART 3 (ADMIN APIs)

## 11. ADMIN POLICY APIs

### 11.1 Get All Policies (Admin)
**Endpoint**: `GET http://localhost:9090/api/admin/policies?page=0&size=100`  
**Auth**: Required (ADMIN only)  
**Description**: Get all policies with pagination

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Policies retrieved successfully",
  "data": [
    {
      "policyId": 1,
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
      "description": "Comprehensive education plan"
    }
  ],
  "page": 0,
  "size": 100,
  "totalElements": 5,
  "totalPages": 1,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 11.2 Get Policy by ID (Admin)
**Endpoint**: `GET http://localhost:9090/api/admin/policies/{policyId}`  
**Auth**: Required (ADMIN only)  
**Description**: Get specific policy details

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `policyId` (Long, required): Policy ID

**Example**: `GET http://localhost:9090/api/admin/policies/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Policy retrieved successfully",
  "data": {
    "policyId": 1,
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
    "description": "Comprehensive education plan"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 11.3 Create Policy
**Endpoint**: `POST http://localhost:9090/api/admin/policies`  
**Auth**: Required (ADMIN only)  
**Description**: Create new policy

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Request Body**:
```json
{
  "policyName": "New Education Plan",
  "basePremium": 6000.00,
  "durationYears": 12,
  "bonusPercentage": 18.00,
  "riskCoverageAmount": 1500000.00,
  "minChildAge": 0,
  "maxChildAge": 12,
  "maturityBenefitAmount": 750000.00,
  "deathBenefitMultiplier": 2.5,
  "waiverOfPremium": true,
  "isActive": true,
  "description": "New comprehensive plan"
}
```

**Field Details**:
- `policyName` (String, required): Policy name
- `basePremium` (BigDecimal, required): Base premium amount
- `durationYears` (int, required): Policy duration in years
- `bonusPercentage` (BigDecimal, required): Bonus percentage
- `riskCoverageAmount` (BigDecimal, required): Coverage amount
- `minChildAge` (int, required): Minimum child age
- `maxChildAge` (int, required): Maximum child age
- `maturityBenefitAmount` (BigDecimal, required): Maturity benefit
- `deathBenefitMultiplier` (BigDecimal, required): Death benefit multiplier
- `waiverOfPremium` (boolean, required): Waiver of premium flag
- `isActive` (boolean, required): Active status
- `description` (String, optional): Policy description

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Policy created successfully",
  "data": {
    "policyId": 6,
    "policyName": "New Education Plan",
    "basePremium": 6000.00,
    "isActive": true
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 11.4 Update Policy
**Endpoint**: `PUT http://localhost:9090/api/admin/policies/{policyId}`  
**Auth**: Required (ADMIN only)  
**Description**: Update existing policy

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `policyId` (Long, required): Policy ID

**Request Body**: Same as Create Policy

**Example**: `PUT http://localhost:9090/api/admin/policies/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Policy updated successfully",
  "data": {
    "policyId": 1,
    "policyName": "Updated Plan",
    "basePremium": 6000.00
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 11.5 Delete Policy
**Endpoint**: `DELETE http://localhost:9090/api/admin/policies/{policyId}`  
**Auth**: Required (ADMIN only)  
**Description**: Delete policy

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `policyId` (Long, required): Policy ID

**Example**: `DELETE http://localhost:9090/api/admin/policies/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Policy deleted successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 12. ADMIN APPLICATION APIs

### 12.1 Get All Applications
**Endpoint**: `GET http://localhost:9090/api/admin/policy-applications?page=0&size=10`  
**Auth**: Required (ADMIN only)  
**Description**: Get all policy applications

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "All applications retrieved successfully",
  "data": [
    {
      "applicationId": 1,
      "policyNumber": "POL-1234567890",
      "policyName": "BrightFuture Plan",
      "childName": "Aarav Kumar",
      "userName": "John Doe",
      "status": "PENDING",
      "applicationDate": "2026-03-09"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 25,
  "totalPages": 3,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 12.2 Approve Application
**Endpoint**: `PUT http://localhost:9090/api/admin/policy-applications/{applicationId}/approve`  
**Auth**: Required (ADMIN only)  
**Description**: Approve policy application

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Example**: `PUT http://localhost:9090/api/admin/policy-applications/1/approve`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application approved successfully",
  "data": {
    "applicationId": 1,
    "policyNumber": "POL-1234567890",
    "status": "APPROVED",
    "approvalDate": "2026-03-09",
    "subscriptionCreated": true,
    "subscriptionNumber": "SUB-1234567890"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Admin approves application
2. Application status → APPROVED
3. Approval date recorded
4. **PolicySubscription automatically created**
5. Subscription number generated (SUB-{timestamp})
6. Subscription status → ACTIVE
7. Coverage officially starts

---

### 12.3 Reject Application
**Endpoint**: `PUT http://localhost:9090/api/admin/policy-applications/{applicationId}/reject?rejectionReason=Age limit exceeded`  
**Auth**: Required (ADMIN only)  
**Description**: Reject policy application

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Query Parameters**:
- `rejectionReason` (String, optional): Reason for rejection

**Example**: `PUT http://localhost:9090/api/admin/policy-applications/1/reject?rejectionReason=Child age exceeds limit`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application rejected successfully",
  "data": {
    "applicationId": 1,
    "status": "REJECTED",
    "rejectionReason": "Child age exceeds limit",
    "rejectionDate": "2026-03-09"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Admin rejects application
2. Application status → REJECTED
3. Rejection reason stored
4. No subscription created

---

## 13. ADMIN CLAIM APIs

### 13.1 Get All Claims
**Endpoint**: `GET http://localhost:9090/api/admin/claims?page=0&size=10`  
**Auth**: Required (ADMIN only)  
**Description**: Get all claims in system

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "All claims retrieved successfully",
  "data": [
    {
      "claimId": 1,
      "subscriptionNumber": "SUB-1234567890",
      "userName": "John Doe",
      "claimType": "DEATH",
      "claimAmount": 1000000.00,
      "status": "SUBMITTED",
      "claimDate": "2026-03-09"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 15,
  "totalPages": 2,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 13.2 Approve Claim
**Endpoint**: `PUT http://localhost:9090/api/admin/claims/{claimId}/approve`  
**Auth**: Required (ADMIN only)  
**Description**: Approve insurance claim

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `claimId` (Long, required): Claim ID

**Example**: `PUT http://localhost:9090/api/admin/claims/1/approve`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Claim approved successfully",
  "data": {
    "claimId": 1,
    "status": "APPROVED",
    "approvalDate": "2026-03-09",
    "claimAmount": 1000000.00
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Admin approves claim
2. Claim status → APPROVED
3. Approval date recorded
4. Payout initiated
5. Claim status → PAID (after payout)

---

### 13.3 Reject Claim
**Endpoint**: `PUT http://localhost:9090/api/admin/claims/{claimId}/reject`  
**Auth**: Required (ADMIN only)  
**Description**: Reject insurance claim

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `claimId` (Long, required): Claim ID

**Example**: `PUT http://localhost:9090/api/admin/claims/1/reject`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Claim rejected successfully",
  "data": {
    "claimId": 1,
    "status": "REJECTED",
    "rejectionDate": "2026-03-09"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 14. ADMIN DASHBOARD APIs

### 14.1 Get Dashboard Metrics
**Endpoint**: `GET http://localhost:9090/api/admin/dashboard`  
**Auth**: Required (ADMIN only)  
**Description**: Get dashboard statistics

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Dashboard metrics retrieved successfully",
  "data": {
    "activePoliciesCount": 50,
    "totalPremiumCollected": 5000000.00,
    "totalClaimsCount": 15,
    "totalClaimsAmount": 10000000.00,
    "totalUsers": 100,
    "totalApplications": 75
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Metrics Explained**:
- `activePoliciesCount`: Total active subscriptions
- `totalPremiumCollected`: Sum of all premium payments
- `totalClaimsCount`: Total claims filed
- `totalClaimsAmount`: Sum of approved claim amounts
- `totalUsers`: Total registered users
- `totalApplications`: Total policy applications

---

### 14.2 Get Monthly Revenue Report
**Endpoint**: `GET http://localhost:9090/api/admin/dashboard/revenue?year=2026`  
**Auth**: Required (ADMIN only)  
**Description**: Get monthly revenue breakdown

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Query Parameters**:
- `year` (int, required): Year for report

**Example**: `GET http://localhost:9090/api/admin/dashboard/revenue?year=2026`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Monthly revenue report retrieved successfully",
  "data": [
    {
      "month": "2026-01",
      "revenue": 500000.00,
      "policyCount": 10,
      "totalPremium": 500000.00,
      "claimsCount": 2,
      "totalClaims": 200000.00
    },
    {
      "month": "2026-02",
      "revenue": 600000.00,
      "policyCount": 12,
      "totalPremium": 600000.00,
      "claimsCount": 1,
      "totalClaims": 100000.00
    }
  ],
  "timestamp": "2026-03-09T10:30:00"
}
```

**Report Fields**:
- `month`: Month in YYYY-MM format
- `revenue`: Total premium collected
- `policyCount`: New applications in month
- `totalPremium`: Sum of premiums
- `claimsCount`: Claims filed in month
- `totalClaims`: Sum of claim amounts

---

## 🔄 COMPLETE WORKFLOWS

### Workflow 1: User Registration to Policy Purchase

1. **Register User**
   ```
   POST /api/auth/register
   → Get JWT token
   ```

2. **Add Address**
   ```
   POST /api/address
   → Address created
   ```

3. **Register Child**
   ```
   POST /api/children
   → Child registered
   ```

4. **Browse Policies**
   ```
   GET /api/policies
   → View available policies
   ```

5. **Apply for Policy**
   ```
   POST /api/policy-applications
   → Application created (status: PENDING)
   ```

6. **Add Nominee**
   ```
   POST /api/nominees
   → Nominee added
   ```

7. **Wait for Admin Approval**
   ```
   Admin: PUT /api/admin/policy-applications/{id}/approve
   → Application approved
   → Subscription auto-created (status: ACTIVE)
   ```

8. **Make Premium Payments**
   ```
   POST /api/premium-payments
   → Payment recorded
   ```

9. **File Claim (when needed)**
   ```
   POST /api/claims
   → Claim submitted (status: SUBMITTED)
   ```

10. **Admin Approves Claim**
    ```
    Admin: PUT /api/admin/claims/{id}/approve
    → Claim approved
    → Payout initiated
    ```

---

### Workflow 2: Admin Dashboard Management

1. **Login as Admin**
   ```
   POST /api/auth/login (role: ADMIN)
   → Get admin JWT token
   ```

2. **View Dashboard**
   ```
   GET /api/admin/dashboard
   → View metrics
   ```

3. **View Revenue Report**
   ```
   GET /api/admin/dashboard/revenue?year=2026
   → View monthly breakdown
   ```

4. **Manage Policies**
   ```
   GET /api/admin/policies
   POST /api/admin/policies (create new)
   PUT /api/admin/policies/{id} (update)
   DELETE /api/admin/policies/{id} (delete)
   ```

5. **Review Applications**
   ```
   GET /api/admin/policy-applications
   PUT /api/admin/policy-applications/{id}/approve
   PUT /api/admin/policy-applications/{id}/reject
   ```

6. **Process Claims**
   ```
   GET /api/admin/claims
   PUT /api/admin/claims/{id}/approve
   PUT /api/admin/claims/{id}/reject
   ```

7. **View All Users**
   ```
   GET /api/users
   GET /api/users/{id}
   ```

---

## 🔐 AUTHENTICATION FLOW

### How JWT Works

1. **User Logs In**
   ```
   POST /api/auth/login
   → Backend validates credentials
   → JWT token generated (24-hour expiry)
   → Token contains: userId, email, role
   ```

2. **Frontend Stores Token**
   ```javascript
   localStorage.setItem('token', response.data.token);
   ```

3. **Frontend Sends Token**
   ```javascript
   headers: {
     'Authorization': `Bearer ${token}`
   }
   ```

4. **Backend Validates Token**
   ```
   → JwtAuthenticationFilter intercepts request
   → Extracts token from Authorization header
   → Validates token signature
   → Extracts userId from token
   → Loads user from database
   → Sets Spring Security context
   → Controller checks @PreAuthorize
   ```

---

## 📊 STATUS VALUES

### Application Status
- `PENDING` - Awaiting admin approval
- `APPROVED` - Approved by admin
- `REJECTED` - Rejected by admin
- `CANCELLED` - Cancelled by user

### Subscription Status
- `ACTIVE` - Currently active
- `MATURED` - Reached maturity date
- `LAPSED` - Premiums not paid

### Claim Status
- `SUBMITTED` - Claim filed
- `APPROVED` - Approved by admin
- `REJECTED` - Rejected by admin
- `PAID` - Payout completed

### Payment Status
- `PENDING` - Payment due
- `PAID` - Payment completed
- `OVERDUE` - Past due date

### Payment Frequency
- `MONTHLY` - Every month
- `QUARTERLY` - Every 3 months
- `YEARLY` - Every year

---

## ⚠️ ERROR CODES

| Code | Status | Meaning |
|------|--------|---------|
| 200 | OK | Success |
| 201 | Created | Resource created |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 500 | Internal Server Error | Server error |

---

## 🎯 QUICK REFERENCE

**Base URL**: `http://localhost:9090`

**Auth Header**: `Authorization: Bearer {token}`

**Date Format**: `YYYY-MM-DD`

**Pagination**: `?page=0&size=10`

**Admin Credentials**: Register via `/api/auth/register` with role: "ADMIN"

**H2 Console**: `http://localhost:9090/h2-console`

**Swagger UI**: `http://localhost:9090/swagger-ui.html`

---

**END OF DOCUMENTATION**
