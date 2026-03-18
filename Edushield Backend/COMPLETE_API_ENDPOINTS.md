# 🚀 COMPLETE API ENDPOINTS DOCUMENTATION

**Base URL**: `http://localhost:9090`

---

## 📋 TABLE OF CONTENTS

1. [Authentication APIs](#1-authentication-apis)
2. [User Management APIs](#2-user-management-apis)
3. [Address APIs](#3-address-apis)
4. [Child Management APIs](#4-child-management-apis)
5. [Policy APIs (Public)](#5-policy-apis-public)
6. [Policy Application APIs](#6-policy-application-apis)
7. [Policy Subscription APIs](#7-policy-subscription-apis)
8. [Premium Payment APIs](#8-premium-payment-apis)
9. [Nominee APIs](#9-nominee-apis)
10. [Claim APIs](#10-claim-apis)
11. [Admin Policy APIs](#11-admin-policy-apis)
12. [Admin Application APIs](#12-admin-application-apis)
13. [Admin Claim APIs](#13-admin-claim-apis)
14. [Admin Dashboard APIs](#14-admin-dashboard-apis)

---

## 1. AUTHENTICATION APIs

### 1.1 Register User
**Endpoint**: `POST http://localhost:9090/api/auth/register`  
**Auth**: None  
**Description**: Register new user (USER or ADMIN role)

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "role": "USER"
}
```

**Field Details**:
- `name` (String, required): Full name
- `email` (String, required): Valid email address
- `password` (String, required): Minimum 6 characters
- `phone` (String, required): 10-digit phone number
- `role` (String, required): "USER" or "ADMIN"

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9...",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "User already exists with this email",
  "errorCode": "DUPLICATE_RESOURCE",
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Frontend sends registration data
2. Backend validates email uniqueness
3. Password encrypted with BCrypt
4. User saved to database
5. JWT token generated
6. Token + user info returned

---

### 1.2 Login
**Endpoint**: `POST http://localhost:9090/api/auth/login`  
**Auth**: None  
**Description**: Login and get JWT token

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "Password123"
}
```

**Field Details**:
- `email` (String, required): Registered email
- `password` (String, required): User password

**Success Response** (200 OK):
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
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "errorCode": "INVALID_CREDENTIALS",
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Frontend sends credentials
2. Backend validates email exists
3. Password compared with BCrypt hash
4. JWT token generated (24-hour expiry)
5. Token + user info returned
6. Frontend stores token in localStorage/sessionStorage

---

## 2. USER MANAGEMENT APIs

### 2.1 Get Current User Profile
**Endpoint**: `GET http://localhost:9090/api/users/me`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get logged-in user's profile

**Headers**:
```
Authorization: Bearer {token}
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "USER",
    "createdAt": "2026-03-09T10:30:00"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

**Workflow**:
1. Frontend sends request with JWT token
2. Backend extracts userId from token
3. User fetched from database
4. User profile returned

---

### 2.2 Update Current User Profile
**Endpoint**: `PUT http://localhost:9090/api/users/me`  
**Auth**: Required (USER or ADMIN)  
**Description**: Update logged-in user's profile

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "name": "John Updated",
  "phone": "9999999999"
}
```

**Field Details**:
- `name` (String, optional): Updated name
- `phone` (String, optional): Updated phone

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "userId": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "9999999999",
    "role": "USER",
    "createdAt": "2026-03-09T10:30:00"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 2.3 Get All Users (Admin)
**Endpoint**: `GET http://localhost:9090/api/users?page=0&size=10`  
**Auth**: Required (ADMIN only)  
**Description**: Get all users with pagination

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
  "message": "Users retrieved successfully",
  "data": [
    {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "USER",
      "createdAt": "2026-03-09T10:30:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 50,
  "totalPages": 5,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 2.4 Get User by ID (Admin)
**Endpoint**: `GET http://localhost:9090/api/users/{userId}`  
**Auth**: Required (ADMIN only)  
**Description**: Get specific user details

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `userId` (Long, required): User ID

**Example**: `GET http://localhost:9090/api/users/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "userId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "USER",
    "createdAt": "2026-03-09T10:30:00"
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 2.5 Delete User (Admin)
**Endpoint**: `DELETE http://localhost:9090/api/users/{userId}`  
**Auth**: Required (ADMIN only)  
**Description**: Delete user from system

**Headers**:
```
Authorization: Bearer {admin_token}
```

**URL Parameters**:
- `userId` (Long, required): User ID to delete

**Example**: `DELETE http://localhost:9090/api/users/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 3. ADDRESS APIs

### 3.1 Add Address
**Endpoint**: `POST http://localhost:9090/api/address`  
**Auth**: Required (USER or ADMIN)  
**Description**: Add address for logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "street": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "zipCode": "400001",
  "country": "India"
}
```

**Field Details**:
- `street` (String, required): Street address
- `city` (String, required): City name
- `state` (String, required): State name
- `zipCode` (String, required): Postal code
- `country` (String, required): Country name

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Address added successfully",
  "data": {
    "addressId": 1,
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 3.2 Get Address by User
**Endpoint**: `GET http://localhost:9090/api/address/user/{userId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get address for specific user

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `userId` (Long, required): User ID

**Example**: `GET http://localhost:9090/api/address/user/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Address retrieved successfully",
  "data": {
    "addressId": 1,
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001",
    "country": "India",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 3.3 Update Address
**Endpoint**: `PUT http://localhost:9090/api/address/{addressId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Update existing address

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `addressId` (Long, required): Address ID

**Request Body**:
```json
{
  "street": "456 New Street",
  "city": "Delhi",
  "state": "Delhi",
  "zipCode": "110001",
  "country": "India"
}
```

**Example**: `PUT http://localhost:9090/api/address/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Address updated successfully",
  "data": {
    "addressId": 1,
    "street": "456 New Street",
    "city": "Delhi",
    "state": "Delhi",
    "zipCode": "110001",
    "country": "India",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 3.4 Delete Address
**Endpoint**: `DELETE http://localhost:9090/api/address/{addressId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Delete address

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `addressId` (Long, required): Address ID

**Example**: `DELETE http://localhost:9090/api/address/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Address deleted successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 4. CHILD MANAGEMENT APIs

### 4.1 Add Child
**Endpoint**: `POST http://localhost:9090/api/children`  
**Auth**: Required (USER or ADMIN)  
**Description**: Register child for logged-in user

**Headers**:
```
Authorization: Bearer {token}
```

**Request Body**:
```json
{
  "childName": "Aarav Kumar",
  "dateOfBirth": "2018-05-15",
  "gender": "Male",
  "schoolName": "Delhi Public School",
  "educationGoal": "Engineering"
}
```

**Field Details**:
- `childName` (String, required): Child's full name
- `dateOfBirth` (String, required): Format: YYYY-MM-DD
- `gender` (String, required): "Male" or "Female"
- `schoolName` (String, optional): School name
- `educationGoal` (String, optional): Education goal

**Success Response** (201 Created):
```json
{
  "success": true,
  "message": "Child added successfully",
  "data": {
    "childId": 1,
    "childName": "Aarav Kumar",
    "dateOfBirth": "2018-05-15",
    "age": 7,
    "gender": "Male",
    "schoolName": "Delhi Public School",
    "educationGoal": "Engineering",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 4.2 Get All Children
**Endpoint**: `GET http://localhost:9090/api/children?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get all children of logged-in user

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
  "message": "Children retrieved successfully",
  "data": [
    {
      "childId": 1,
      "childName": "Aarav Kumar",
      "dateOfBirth": "2018-05-15",
      "age": 7,
      "gender": "Male",
      "schoolName": "Delhi Public School",
      "educationGoal": "Engineering",
      "userId": 1
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

### 4.3 Get My Children (Alias)
**Endpoint**: `GET http://localhost:9090/api/children/my?page=0&size=10`  
**Auth**: Required (USER or ADMIN)  
**Description**: Same as Get All Children (alias endpoint)

**Headers**:
```
Authorization: Bearer {token}
```

**Query Parameters**:
- `page` (int, optional, default=0): Page number
- `size` (int, optional, default=10): Page size

**Response**: Same as 4.2

---

### 4.4 Get Child by ID
**Endpoint**: `GET http://localhost:9090/api/children/{childId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Get specific child details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `childId` (Long, required): Child ID

**Example**: `GET http://localhost:9090/api/children/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Child retrieved successfully",
  "data": {
    "childId": 1,
    "childName": "Aarav Kumar",
    "dateOfBirth": "2018-05-15",
    "age": 7,
    "gender": "Male",
    "schoolName": "Delhi Public School",
    "educationGoal": "Engineering",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 4.5 Update Child
**Endpoint**: `PUT http://localhost:9090/api/children/{childId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Update child details

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `childId` (Long, required): Child ID

**Request Body**:
```json
{
  "childName": "Aarav Kumar Updated",
  "dateOfBirth": "2018-05-15",
  "gender": "Male",
  "schoolName": "New School",
  "educationGoal": "Medicine"
}
```

**Example**: `PUT http://localhost:9090/api/children/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Child updated successfully",
  "data": {
    "childId": 1,
    "childName": "Aarav Kumar Updated",
    "dateOfBirth": "2018-05-15",
    "age": 7,
    "gender": "Male",
    "schoolName": "New School",
    "educationGoal": "Medicine",
    "userId": 1
  },
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 4.6 Delete Child
**Endpoint**: `DELETE http://localhost:9090/api/children/{childId}`  
**Auth**: Required (USER or ADMIN)  
**Description**: Delete child

**Headers**:
```
Authorization: Bearer {token}
```

**URL Parameters**:
- `childId` (Long, required): Child ID

**Example**: `DELETE http://localhost:9090/api/children/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Child deleted successfully",
  "data": null,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

## 5. POLICY APIs (Public)

### 5.1 Get All Policies
**Endpoint**: `GET http://localhost:9090/api/policies?page=0&size=10`  
**Auth**: None (Public)  
**Description**: Get all active policies

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
  "size": 10,
  "totalElements": 5,
  "totalPages": 1,
  "timestamp": "2026-03-09T10:30:00"
}
```

---

### 5.2 Get Policy by ID
**Endpoint**: `GET http://localhost:9090/api/policies/{policyId}`  
**Auth**: None (Public)  
**Description**: Get specific policy details

**URL Parameters**:
- `policyId` (Long, required): Policy ID

**Example**: `GET http://localhost:9090/api/policies/1`

**Success Response** (200 OK):
```json
{
  "success": true,
  "message": "Policy details retrieved successfully",
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

**Continue to Part 2...**
