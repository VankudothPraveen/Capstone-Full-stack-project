# 🚀 API Testing Guide - Complete Workflow

## ⚡ Quick Start

### Base URL
```
http://localhost:9090
```

### Important Notes
✅ **Data Persistence**: All data is saved to file-based H2 database (`./data/child_insurance_db.mv.db`)  
✅ **No Re-initialization**: Seed data (Roles & Policies) are created ONLY ONCE on first startup  
✅ **Restart Safe**: All user registrations, applications, and transactions persist across server restarts  

---

## 📋 Step-by-Step Testing Workflow

### Step 1: Register as ADMIN

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIiwidXNlcklkIjoxLCJlbWFpbCI6ImFkbWluQGluc3VyYW5jZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDk2MzA0MDAsImV4cCI6MTcwOTcxNjgwMH0.xyz...",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "Admin User",
      "email": "admin@insurance.com",
      "role": "ADMIN"
    }
  }
}
```

**Action**: Copy the `token` value for subsequent requests

---

### Step 2: Login as ADMIN

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}
```

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "Admin User",
      "email": "admin@insurance.com",
      "role": "ADMIN"
    }
  }
}
```

---

### Step 3: Register as USER (Customer)

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "User@123",
  "phone": "9876543210",
  "role": "USER"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "userId": 2,
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "role": "USER"
    }
  }
}
```

---

### Step 4: View Available Policies (No Auth Required)

**Endpoint**: `GET /api/policies`

**No Authorization Header Needed**

**Expected Response** (200 OK):
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
      "expectedReturnRate": 6.00,
      "bonusRate": 15.50,
      "riskCoverageMultiplier": 2.00,
      "minChildAge": 0,
      "maxChildAge": 10,
      "deathBenefitMultiplier": 2.0,
      "waiverOfPremium": true,
      "isActive": true,
      "description": "Comprehensive education plan for school-going children"
    },
    {
      "policyId": 2,
      "policyName": "ScholarSecure Plan",
      "basePremium": 8000.00,
      "durationYears": 15,
      "expectedReturnRate": 7.00,
      "bonusRate": 20.00,
      "riskCoverageMultiplier": 2.50,
      "minChildAge": 5,
      "maxChildAge": 15,
      "deathBenefitMultiplier": 2.5,
      "waiverOfPremium": true,
      "isActive": true,
      "description": "Higher education plan with enhanced benefits"
    }
    // ... more policies
  ]
}
```

---

### Step 5: Add Child (Authenticated - USER)

**Endpoint**: `POST /api/children`

**Headers**:
```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Aarav Kumar",
  "dateOfBirth": "2018-05-15",
  "gender": "MALE",
  "relationship": "Son"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Child added successfully",
  "data": {
    "childId": 1,
    "name": "Aarav Kumar",
    "dateOfBirth": "2018-05-15",
    "age": 7,
    "gender": "MALE",
    "relationship": "Son",
    "parentUserId": 2
  }
}
```

---

### Step 6: Add Address (Authenticated - USER)

**Endpoint**: `POST /api/address`

**Headers**:
```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Request Body**:
```json
{
  "street": "123 MG Road",
  "city": "Bangalore",
  "state": "Karnataka",
  "pincode": "560001",
  "country": "India"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "addressId": 1,
    "street": "123 MG Road",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001",
    "country": "India",
    "userId": 2
  }
}
```

---

### Step 7: Apply for Policy (Authenticated - USER)

**Endpoint**: `POST /api/policy-applications`

**Headers**:
```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Request Body**:
```json
{
  "policyId": 1,
  "childId": 1,
  "premiumAmount": 5000.00,
  "premiumFrequency": "MONTHLY",
  "nomineeName": "Priya Kumar",
  "nomineeRelationship": "Mother",
  "nomineeAge": 35,
  "nomineePhone": "9876543211"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Policy application submitted successfully",
  "data": {
    "applicationId": 1,
    "policyName": "BrightFuture Plan",
    "childName": "Aarav Kumar",
    "premiumAmount": 5000.00,
    "premiumFrequency": "MONTHLY",
    "applicationStatus": "PENDING",
    "applicationDate": "2026-03-10T10:30:00"
  }
}
```

---

### Step 8: Approve Policy Application (Authenticated - ADMIN)

**Endpoint**: `PUT /api/admin/policy-applications/{applicationId}/approve`

**Headers**:
```
Authorization: Bearer {ADMIN_TOKEN}
```

**Request**: No body needed

**Expected Response** (200 OK):
```json
{
  "success": true,
  "message": "Policy application approved successfully",
  "data": {
    "applicationId": 1,
    "applicationStatus": "APPROVED",
    "approvedAt": "2026-03-10T11:00:00"
  }
}
```

---

### Step 9: Make Premium Payment (Authenticated - USER)

**Endpoint**: `POST /api/premium-payments`

**Headers**:
```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Request Body**:
```json
{
  "applicationId": 1,
  "amount": 5000.00,
  "paymentMethod": "UPI",
  "transactionId": "TXN123456789"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Premium payment successful",
  "data": {
    "paymentId": 1,
    "applicationId": 1,
    "amount": 5000.00,
    "paymentDate": "2026-03-10T12:00:00",
    "paymentMethod": "UPI",
    "transactionId": "TXN123456789",
    "paymentStatus": "SUCCESS"
  }
}
```

---

### Step 10: Raise a Claim (Authenticated - USER)

**Endpoint**: `POST /api/claims`

**Headers**:
```
Authorization: Bearer {USER_TOKEN}
Content-Type: application/json
```

**Request Body**:
```json
{
  "applicationId": 1,
  "claimType": "MATURITY",
  "claimAmount": 80000.00,
  "claimReason": "Child completed 10 years of schooling"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "Claim submitted successfully",
  "data": {
    "claimId": 1,
    "applicationId": 1,
    "claimType": "MATURITY",
    "claimAmount": 80000.00,
    "claimReason": "Child completed 10 years of schooling",
    "claimStatus": "PENDING",
    "claimDate": "2026-03-10T13:00:00"
  }
}
```

---

## 🔐 Authorization Headers

### For ADMIN endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIi...
```

### For USER endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyYWplc2hAZXhhbXBsZS5jb20i...
```

---

## 📊 Admin Dashboard Endpoints

### Get Active Policies Count
```
GET /api/admin/dashboard/active-policies
Authorization: Bearer {ADMIN_TOKEN}
```

### Get Total Premium Collected
```
GET /api/admin/dashboard/total-premium
Authorization: Bearer {ADMIN_TOKEN}
```

### Get Total Claims
```
GET /api/admin/dashboard/total-claims
Authorization: Bearer {ADMIN_TOKEN}
```

### Get Monthly Revenue Report
```
GET /api/admin/dashboard/monthly-revenue
Authorization: Bearer {ADMIN_TOKEN}
```

---

## 🔧 H2 Database Console Access

**URL**: http://localhost:9090/h2-console

**Connection Details**:
- **JDBC URL**: `jdbc:h2:file:./data/child_insurance_db`
- **Username**: `sa`
- **Password**: `Praveen@12`

---

## 🎯 Testing Tips

1. **First Time Setup**:
   - Start the application
   - Database is created automatically with seed data
   - Register admin and users via API

2. **Subsequent Runs**:
   - All data persists automatically
   - No need to re-register users
   - Just login to get fresh JWT token

3. **Token Expiry**:
   - Tokens expire after 24 hours
   - If you get 401 Unauthorized, login again to get a new token

4. **Reset Database**:
   - Stop the application
   - Delete `./data` folder
   - Restart the application

---

## ✅ Success Indicators

- ✅ Application starts without errors
- ✅ Console shows: "✅ Database initialization complete!"
- ✅ Roles created: ADMIN, USER
- ✅ 5 Policies created successfully
- ✅ BCrypt password hash displayed in logs
- ✅ Server running on port 9090

---

## 🐛 Troubleshooting

### Issue: 401 Unauthorized
**Solution**: Login again to get a fresh JWT token

### Issue: 403 Forbidden
**Solution**: Make sure you're using the correct role token (ADMIN vs USER)

### Issue: Database locked
**Solution**: Stop all running instances and restart

### Issue: Cannot find user
**Solution**: Register the user first via `/api/auth/register`

---

## 🎉 Complete!

You now have a fully persistent Child Education Insurance backend system. All data survives server restarts!

