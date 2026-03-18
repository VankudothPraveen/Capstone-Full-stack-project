# 🔐 REGISTER & LOGIN - Complete Guide

## 📍 Base URL
```
http://localhost:9090
```

---

## 1️⃣ REGISTER AS ADMIN

### Endpoint
```
POST /api/auth/register
```

### Request
```json
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```

### cURL Command
```bash
curl -X POST http://localhost:9090/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Admin User\",\"email\":\"admin@insurance.com\",\"password\":\"Admin@123\",\"phone\":\"9999999999\",\"role\":\"ADMIN\"}"
```

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIiwidXNlcklkIjoxLCJlbWFpbCI6ImFkbWluQGluc3VyYW5jZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDk2MzA0MDAsImV4cCI6MTcwOTcxNjgwMH0.signature",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "Admin User",
      "email": "admin@insurance.com",
      "role": "ADMIN"
    }
  },
  "timestamp": "2026-03-10T10:30:00"
}
```

---

## 2️⃣ REGISTER AS USER (Customer)

### Endpoint
```
POST /api/auth/register
```

### Request
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "User@123",
  "phone": "9876543210",
  "role": "USER"
}
```

### cURL Command
```bash
curl -X POST http://localhost:9090/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rajesh Kumar\",\"email\":\"rajesh@example.com\",\"password\":\"User@123\",\"phone\":\"9876543210\",\"role\":\"USER\"}"
```

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyYWplc2hAZXhhbXBsZS5jb20iLCJ1c2VySWQiOjIsImVtYWlsIjoicmFqZXNoQGV4YW1wbGUuY29tIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3MDk2MzA1MDAsImV4cCI6MTcwOTcxNjkwMH0.signature",
    "tokenType": "Bearer",
    "user": {
      "userId": 2,
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "role": "USER"
    }
  },
  "timestamp": "2026-03-10T10:31:00"
}
```

---

## 3️⃣ LOGIN (ADMIN or USER)

### Endpoint
```
POST /api/auth/login
```

### Login as ADMIN
```json
{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}
```

### Login as USER
```json
{
  "email": "rajesh@example.com",
  "password": "User@123"
}
```

### cURL Command (ADMIN)
```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@insurance.com\",\"password\":\"Admin@123\"}"
```

### cURL Command (USER)
```bash
curl -X POST http://localhost:9090/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"rajesh@example.com\",\"password\":\"User@123\"}"
```

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIiwidXNlcklkIjoxLCJlbWFpbCI6ImFkbWluQGluc3VyYW5jZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MDk3MTY4MDAsImV4cCI6MTcwOTgwMzIwMH0.signature",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "Admin User",
      "email": "admin@insurance.com",
      "role": "ADMIN"
    }
  },
  "timestamp": "2026-03-10T11:00:00"
}
```

---

## 📝 Important Notes

### Password Requirements
- Minimum 6 characters
- Can include special characters
- Case-sensitive

### Role Types
- `ADMIN`: Full system access
- `USER`: Customer access only

### Token Information
- **Validity**: 24 hours
- **Type**: JWT (JSON Web Token)
- **Storage**: Store securely in frontend
- **Usage**: Send in Authorization header

---

## 🔐 Using the JWT Token

### Copy Token from Response
```json
{
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIi..."
  }
}
```

### Use in Subsequent Requests
```
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBpbnN1cmFuY2UuY29tIi...
```

### Example: Get User Profile
```bash
curl -X GET http://localhost:9090/api/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzUxMiJ9..."
```

---

## 🧪 Testing in Postman

### Step 1: Register Admin
1. Method: `POST`
2. URL: `http://localhost:9090/api/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```
5. Click **Send**
6. Copy `data.token` from response

### Step 2: Login
1. Method: `POST`
2. URL: `http://localhost:9090/api/auth/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}
```
5. Click **Send**
6. Copy `data.token` from response

### Step 3: Use Token
1. Go to any authenticated endpoint
2. Click **Authorization** tab
3. Type: `Bearer Token`
4. Token: Paste the copied token
5. Send request

---

## 🧪 Testing in Swagger UI

### Step 1: Open Swagger
```
http://localhost:9090/swagger-ui.html
```

### Step 2: Register Admin
1. Expand **auth-controller**
2. Click **POST /api/auth/register**
3. Click **Try it out**
4. Enter request body:
```json
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```
5. Click **Execute**
6. Copy token from response

### Step 3: Authorize
1. Click **Authorize** button (top right)
2. Enter: `Bearer <paste_token_here>`
3. Click **Authorize**
4. Click **Close**

### Step 4: Test Protected Endpoints
1. Now all authenticated endpoints will work
2. Try **GET /api/users/me**
3. Try **GET /api/admin/dashboard**

---

## ❌ Common Errors

### Error: "User already exists"
**Cause**: Email already registered

**Solution**: 
- Use different email
- OR login with existing credentials

### Error: "Invalid email or password"
**Cause**: Wrong credentials

**Solution**:
- Check email spelling
- Check password (case-sensitive)
- Register first if user doesn't exist

### Error: "Role not found"
**Cause**: Invalid role in request

**Solution**: Use only "ADMIN" or "USER"

### Error: "Validation failed"
**Cause**: Missing or invalid fields

**Solution**: Check all required fields:
- name (required)
- email (required, valid format)
- password (required, min 6 chars)
- phone (required, 10 digits)
- role (required, "ADMIN" or "USER")

---

## ✅ Verification Checklist

- [ ] Application is running on port 9090
- [ ] Can access Swagger UI
- [ ] Can register ADMIN user
- [ ] Receive JWT token after registration
- [ ] Can login with registered credentials
- [ ] Receive JWT token after login
- [ ] Token can be used in authenticated requests
- [ ] Cannot register with same email twice
- [ ] Cannot login with wrong password

---

## 📊 Data Persistence Test

### Test Scenario:
```bash
# Day 1
1. Start application
2. Register admin: admin@test.com / Admin@123
3. Stop application

# Day 2
4. Start application
5. Login: admin@test.com / Admin@123
6. ✅ SUCCESS! Data persisted!
```

---

## 🎯 Quick Reference

| Action | Method | Endpoint | Auth Required |
|--------|--------|----------|---------------|
| Register Admin | POST | /api/auth/register | ❌ No |
| Register User | POST | /api/auth/register | ❌ No |
| Login | POST | /api/auth/login | ❌ No |
| Get Profile | GET | /api/users/me | ✅ Yes |
| View Policies | GET | /api/policies | ❌ No |
| Admin Dashboard | GET | /api/admin/dashboard/* | ✅ Yes (ADMIN) |

---

## 🎉 Ready to Test!

You have everything you need:
- ✅ Clear endpoints
- ✅ Example requests
- ✅ Expected responses
- ✅ Testing instructions
- ✅ Error handling guide

**Start your application and begin testing!**

