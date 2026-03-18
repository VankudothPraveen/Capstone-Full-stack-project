# 🚀 COMPLETE API ENDPOINTS - PART 2

## 6. POLICY APPLICATION APIs

### 6.1 Apply for Policy
**Endpoint**: `POST http://localhost:9090/api/policy-applications`  
**Auth**: Required (USER or ADMIN)  
**Description**: Submit policy application

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "policyId": 1,
  "childId": 1,
  "paymentFrequency": "MONTHLY",
  "startDate": "2026-04-01",
  "endDate": "2036-04-01"
}
```

**Field Details**:
- `policyId` (Long, required): Policy ID to apply for
- `childId` (Long, required): Child ID
- `paymentFrequency` (String, required): "MONTHLY", "QUARTERLY", or "YEARLY"
- `startDate` (String, required): Format: YYYY-MM-DD
- `endDate` (String, required): Format: YYYY-MM-DD

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Policy application submitted successfully",
  "data": {
    "applicationId": 1,
    "policyNumber": "POL-1234567890",
    "policyId": 1,
    "policyName": "BrightFuture Plan",
    "childId": 1,
    "childName": "Aarav Kumar",
    "userId": 1,
    "userName": "John Doe",
    "paymentFrequency": "MONTHLY",
    "startDate": "2026-04-01",
    "endDate": "2036-04-01",
    "status": "PENDING",
    "applicationDate": "2026-03-09",
    "approvalDate": null,
    "rejectionReason": null
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. User selects policy and child
2. System validates child age against policy limits
3. Application created with status PENDING
4. Unique policy number generated
5. Waits for admin approval

---

### 6.2 Get My Applications
**Endpoint**: `GET http://localhost:9090/api/policy-applications/my?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get all applications of logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Applications retrieved successfully",
  "data": [
    {
      "applicationId": 1,
      "policyNumber": "POL-1234567890",
      "policyName": "BrightFuture Plan",
      "childName": "Aarav Kumar",
      "status": "PENDING",
      "applicationDate": "2026-03-09"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 3,
  "totalPages": 1,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 6.3 Get Application by ID
**Endpoint**: `GET http://localhost:9090/api/policy-applications/{applicationId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get specific application details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Example**: `GET http://localhost:9090/api/policy-applications/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application details retrieved successfully",
  "data": {
    "applicationId": 1,
    "policyNumber": "POL-1234567890",
    "policyId": 1,
    "policyName": "BrightFuture Plan",
    "childId": 1,
    "childName": "Aarav Kumar",
    "userId": 1,
    "userName": "John Doe",
    "paymentFrequency": "MONTHLY",
    "startDate": "2026-04-01",
    "endDate": "2036-04-01",
    "status": "PENDING",
    "applicationDate": "2026-03-09",
    "approvalDate": null,
    "rejectionReason": null
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 6.4 Cancel Application
**Endpoint**: `PUT http://localhost:9090/api/policy-applications/{applicationId}/cancel`  
**Auth**: Required (USER or ADMIN)  
**Description**: Cancel pending application

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Example**: `PUT http://localhost:9090/api/policy-applications/1/cancel`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Application cancelled successfully",
  "data": {
    "applicationId": 1,
    "status": "CANCELLED"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 7. POLICY SUBSCRIPTION APIs

### 7.1 Get My Subscriptions
**Endpoint**: `GET http://localhost:9090/api/subscriptions/my?page=0&size=10`  
**Auth**: Required (USER)  
**Description**: Get all subscriptions of logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscriptions retrieved successfully",
  "data": {
    "content": [
      {
        "subscriptionId": 1,
        "subscriptionNumber": "SUB-1234567890",
        "policyName": "BrightFuture Plan",
        "childName": "Aarav Kumar",
        "startDate": "2026-04-01",
        "endDate": "2036-04-01",
        "maturityDate": "2036-04-01",
        "coverageAmount": 1000000.00,
        "premiumAmount": 5000.00,
        "status": "ACTIVE",
        "totalPaidAmount": 50000.00
      }
    ],
    "totalElements": 1,
    "totalPages": 1,
    "number": 0,
    "size": 10
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 7.2 Get Subscription by ID
**Endpoint**: `GET http://localhost:9090/api/subscriptions/{subscriptionId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get specific subscription details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `subscriptionId` (Long, required): Subscription ID

**Example**: `GET http://localhost:9090/api/subscriptions/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Subscription retrieved successfully",
  "data": {
    "subscriptionId": 1,
    "subscriptionNumber": "SUB-1234567890",
    "applicationId": 1,
    "policyId": 1,
    "policyName": "BrightFuture Plan",
    "childId": 1,
    "childName": "Aarav Kumar",
    "userId": 1,
    "userName": "John Doe",
    "startDate": "2026-04-01",
    "endDate": "2036-04-01",
    "maturityDate": "2036-04-01",
    "coverageAmount": 1000000.00,
    "premiumAmount": 5000.00,
    "paymentFrequency": "MONTHLY",
    "status": "ACTIVE",
    "totalPaidAmount": 50000.00
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 7.3 Get All Subscriptions (Admin)
**Endpoint**: `GET http://localhost:9090/api/subscriptions?page=0&size=10`  
**Auth**: Required (ADMIN)  
**Description**: Get all subscriptions in system

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
  "message": "All subscriptions retrieved successfully",
  "data": {
    "content": [...],
    "totalElements": 50,
    "totalPages": 5,
    "number": 0,
    "size": 10
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 7.4 Process Matured Subscriptions (Admin)
**Endpoint**: `POST http://localhost:9090/api/subscriptions/process-maturity`  
**Auth**: Required (ADMIN)  
**Description**: Manually trigger maturity processing

**Headers**:
```
Authorization: Bearer {admin_token}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Matured subscriptions processed successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. System checks all ACTIVE subscriptions
2. Compares maturity date with current date
3. Updates status to MATURED if date reached
4. Calculates final benefits

---

## 8. PREMIUM PAYMENT APIs

### 8.1 Pay Premium
**Endpoint**: `POST http://localhost:9090/api/premium-payments`  
**Auth**: Required (USER or ADMIN)  
**Description**: Make premium payment

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "subscriptionId": 1,
  "amount": 5000.00,
  "paymentDate": "2026-03-09",
  "dueDate": "2026-03-05"
}
```

**Field Details**:
- `subscriptionId` (Long, required): Subscription ID
- `amount` (BigDecimal, required): Payment amount
- `paymentDate` (String, required): Format: YYYY-MM-DD
- `dueDate` (String, required): Format: YYYY-MM-DD

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Premium payment successful",
  "data": {
    "paymentId": 1,
    "subscriptionId": 1,
    "subscriptionNumber": "SUB-1234567890",
    "amount": 5000.00,
    "paymentDate": "2026-03-09",
    "dueDate": "2026-03-05",
    "lateFee": 0.00,
    "status": "PAID"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. User submits payment
2. System validates subscription exists
3. Calculates late fee if overdue
4. Payment recorded
5. Subscription totalPaidAmount updated

---

### 8.2 Get Payment History by Application
**Endpoint**: `GET http://localhost:9090/api/premium-payments/application/{applicationId}?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get all payments for specific application

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Example**: `GET http://localhost:9090/api/premium-payments/application/1?page=0&size=10`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment history retrieved successfully",
  "data": [
    {
      "paymentId": 1,
      "subscriptionNumber": "SUB-1234567890",
      "amount": 5000.00,
      "paymentDate": "2026-03-09",
      "dueDate": "2026-03-05",
      "lateFee": 0.00,
      "status": "PAID"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 10,
  "totalPages": 1,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 8.3 Get My Payments
**Endpoint**: `GET http://localhost:9090/api/premium-payments/my?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get all payments of logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User payments retrieved successfully",
  "data": [
    {
      "paymentId": 1,
      "subscriptionNumber": "SUB-1234567890",
      "amount": 5000.00,
      "paymentDate": "2026-03-09",
      "status": "PAID"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 20,
  "totalPages": 2,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 9. NOMINEE APIs

### 9.1 Add Nominee
**Endpoint**: `POST http://localhost:9090/api/nominees`  
**Auth**: Required (USER or ADMIN)  
**Description**: Add nominee for application

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "applicationId": 1,
  "nomineeName": "Jane Doe",
  "relationship": "Spouse",
  "dateOfBirth": "1990-05-20",
  "contactNumber": "9876543210"
}
```

**Field Details**:
- `applicationId` (Long, required): Application ID
- `nomineeName` (String, required): Nominee full name
- `relationship` (String, required): Relationship to applicant
- `dateOfBirth` (String, required): Format: YYYY-MM-DD
- `contactNumber` (String, required): 10-digit phone

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Nominee added successfully",
  "data": {
    "nomineeId": 1,
    "applicationId": 1,
    "nomineeName": "Jane Doe",
    "relationship": "Spouse",
    "dateOfBirth": "1990-05-20",
    "age": 35,
    "contactNumber": "9876543210"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 9.2 Get Nominee by Application
**Endpoint**: `GET http://localhost:9090/api/nominees/application/{applicationId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get nominee for specific application

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `applicationId` (Long, required): Application ID

**Example**: `GET http://localhost:9090/api/nominees/application/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Nominee retrieved successfully",
  "data": {
    "nomineeId": 1,
    "applicationId": 1,
    "nomineeName": "Jane Doe",
    "relationship": "Spouse",
    "dateOfBirth": "1990-05-20",
    "age": 35,
    "contactNumber": "9876543210"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 9.3 Update Nominee
**Endpoint**: `PUT http://localhost:9090/api/nominees/{nomineeId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Update nominee details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `nomineeId` (Long, required): Nominee ID

**Request Body**:
```json
{
  "applicationId": 1,
  "nomineeName": "Jane Updated",
  "relationship": "Spouse",
  "dateOfBirth": "1990-05-20",
  "contactNumber": "9999999999"
}
```

**Example**: `PUT http://localhost:9090/api/nominees/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Nominee updated successfully",
  "data": {
    "nomineeId": 1,
    "nomineeName": "Jane Updated",
    "contactNumber": "9999999999"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 9.4 Delete Nominee
**Endpoint**: `DELETE http://localhost:9090/api/nominees/{nomineeId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Delete nominee

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `nomineeId` (Long, required): Nominee ID

**Example**: `DELETE http://localhost:9090/api/nominees/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Nominee deleted successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 10. CLAIM APIs

### 10.1 Raise Claim
**Endpoint**: `POST http://localhost:9090/api/claims`  
**Auth**: Required (USER or ADMIN)  
**Description**: File insurance claim

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "subscriptionId": 1,
  "claimType": "DEATH",
  "claimAmount": 1000000.00,
  "claimDate": "2026-03-09"
}
```

**Field Details**:
- `subscriptionId` (Long, required): Subscription ID
- `claimType` (String, required): "DEATH" or "MATURITY"
- `claimAmount` (BigDecimal, required): Claim amount
- `claimDate` (String, required): Format: YYYY-MM-DD

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Claim raised successfully",
  "data": {
    "claimId": 1,
    "subscriptionId": 1,
    "subscriptionNumber": "SUB-1234567890",
    "claimType": "DEATH",
    "claimAmount": 1000000.00,
    "claimDate": "2026-03-09",
    "status": "SUBMITTED",
    "submittedDate": "2026-03-09",
    "approvalDate": null,
    "rejectionDate": null,
    "payoutDate": null
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. User files claim
2. Claim created with status SUBMITTED
3. Waits for admin approval
4. If approved, payout initiated

---

### 10.2 Get My Claims
**Endpoint**: `GET http://localhost:9090/api/claims/my?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get all claims of logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User claims retrieved successfully",
  "data": [
    {
      "claimId": 1,
      "subscriptionNumber": "SUB-1234567890",
      "claimType": "DEATH",
      "claimAmount": 1000000.00,
      "status": "SUBMITTED",
      "claimDate": "2026-03-09"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 2,
  "totalPages": 1,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 10.3 Get Claim Details
**Endpoint**: `GET http://localhost:9090/api/claims/{claimId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get specific claim details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `claimId` (Long, required): Claim ID

**Example**: `GET http://localhost:9090/api/claims/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Claim details retrieved successfully",
  "data": {
    "claimId": 1,
    "subscriptionId": 1,
    "subscriptionNumber": "SUB-1234567890",
    "claimType": "DEATH",
    "claimAmount": 1000000.00,
    "claimDate": "2026-03-09",
    "status": "SUBMITTED",
    "submittedDate": "2026-03-09",
    "approvalDate": null,
    "rejectionDate": null,
    "payoutDate": null
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

**Continue to Part 3 for Admin APIs...**
