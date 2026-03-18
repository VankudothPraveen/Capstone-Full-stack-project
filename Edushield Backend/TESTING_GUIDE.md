# Testing Guide - Swagger UI & H2 Database

## Configuration Summary

### H2 Database - Persistent Storage ✅
- **Type**: File-based (data persists across restarts)
- **Location**: `./data/child_insurance_db.mv.db`
- **URL**: `jdbc:h2:file:./data/child_insurance_db`
- **Username**: `sa`
- **Password**: `Praveen@12`
- **Mode**: `update` (preserves existing data)

### Swagger UI ✅
- **URL**: http://localhost:9090/swagger-ui.html
- **API Docs**: http://localhost:9090/v3/api-docs
- **JWT Authentication**: Configured with Bearer token

### H2 Console ✅
- **URL**: http://localhost:9090/h2-console
- **JDBC URL**: `jdbc:h2:file:./data/child_insurance_db`
- **Username**: `sa`
- **Password**: `Praveen@12`

---

## Starting the Application

```bash
mvn clean install
mvn spring-boot:run
```

Application starts on: **http://localhost:9090**

---

## Testing with Swagger UI

### Step 1: Access Swagger UI

Open browser: **http://localhost:9090/swagger-ui.html**

You'll see all API endpoints organized by controllers:
- Auth Controller
- User Controller
- Child Controller
- Policy Controller
- Policy Application Controller
- Premium Payment Controller
- Claim Controller
- Admin Controllers

---

### Step 2: Register a User

1. Expand **auth-controller**
2. Click **POST /api/auth/register**
3. Click **Try it out**
4. Enter request body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "9876543210",
  "role": "USER"
}
```

5. Click **Execute**
6. Copy the JWT token from response

**Response Example:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwi...",
    "tokenType": "Bearer",
    "user": {
      "userId": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "USER"
    }
  }
}
```

---

### Step 3: Authenticate in Swagger

1. Click **Authorize** button (top right, lock icon)
2. Enter: `Bearer <your-token>` (replace `<your-token>` with actual token)
3. Click **Authorize**
4. Click **Close**

Now all authenticated endpoints will use this token automatically!

---

### Step 4: Register Admin User

```json
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```

Copy admin token for admin operations.

---

### Step 5: Test Workflow

#### 5.1 View Available Policies (No Auth Required)

**GET /api/policies**
- Click **Try it out** → **Execute**
- See 5 pre-seeded policies

#### 5.2 Register a Child

**POST /api/children** (USER token required)

```json
{
  "childName": "Aarav Kumar",
  "dateOfBirth": "2018-05-15",
  "gender": "Male",
  "schoolName": "Delhi Public School",
  "educationGoal": "Engineering"
}
```

#### 5.3 Create Policy Application

**POST /api/policy-applications** (USER token required)

```json
{
  "policyId": 1,
  "childId": 1,
  "paymentFrequency": "MONTHLY",
  "startDate": "2024-01-01",
  "endDate": "2034-01-01"
}
```

#### 5.4 Admin Approves Application

Switch to ADMIN token in Authorize button.

**PUT /api/admin/policy-applications/{applicationId}/approve**
- Enter applicationId: `1`
- Click **Execute**

This creates a PolicySubscription automatically!

#### 5.5 Make Premium Payment

Switch back to USER token.

**POST /api/premium-payments**

```json
{
  "applicationId": 1,
  "amount": 5000.00,
  "paymentDate": "2024-01-15",
  "dueDate": "2024-01-10"
}
```

#### 5.6 File a Claim

**POST /api/claims**

```json
{
  "applicationId": 1,
  "claimType": "DEATH",
  "claimAmount": 1000000.00,
  "claimDate": "2024-06-15"
}
```

#### 5.7 Admin Processes Claim

Switch to ADMIN token.

**PUT /api/admin/claims/{claimId}/approve**
- Enter claimId: `1`
- Click **Execute**

---

## Viewing Data in H2 Console

### Step 1: Access H2 Console

Open browser: **http://localhost:9090/h2-console**

### Step 2: Login

- **JDBC URL**: `jdbc:h2:file:./data/child_insurance_db`
- **User Name**: `sa`
- **Password**: `Praveen@12`
- Click **Connect**

### Step 3: Query Data

```sql
-- View all users
SELECT * FROM USERS;

-- View all policies
SELECT * FROM POLICY;

-- View all children
SELECT * FROM CHILD;

-- View all applications
SELECT * FROM POLICY_APPLICATION;

-- View all subscriptions
SELECT * FROM POLICY_SUBSCRIPTION;

-- View all premium payments
SELECT * FROM PREMIUM_PAYMENT;

-- View all claims
SELECT * FROM CLAIM;

-- View benefit calculations
SELECT * FROM BENEFIT_CALCULATION;

-- Complex query: User with their applications
SELECT u.name, u.email, pa.policy_number, pa.status, p.policy_name
FROM USERS u
JOIN POLICY_APPLICATION pa ON u.user_id = pa.user_id
JOIN POLICY p ON pa.policy_id = p.policy_id;

-- Active subscriptions
SELECT * FROM POLICY_SUBSCRIPTION WHERE status = 'ACTIVE';

-- Total premium collected
SELECT SUM(amount) as total_premium FROM PREMIUM_PAYMENT WHERE status = 'PAID';
```

---

## Data Persistence

### How It Works

1. **First Run**: 
   - Creates `./data/` folder
   - Creates `child_insurance_db.mv.db` file
   - Runs `data.sql` to seed roles and policies
   - Creates all tables via Hibernate

2. **Subsequent Runs**:
   - Reads existing database file
   - Preserves all data (users, children, applications, etc.)
   - Updates schema if entity changes detected
   - Does NOT re-run data.sql (roles and policies already exist)

3. **Data Location**:
   - Database file: `./data/child_insurance_db.mv.db`
   - Trace file: `./data/child_insurance_db.trace.db`

### Reset Database

To start fresh:
```bash
# Stop application
# Delete database files
rm -rf ./data/

# Restart application (creates new database)
mvn spring-boot:run
```

---

## Swagger Features

### JWT Authentication
- Click **Authorize** button
- Enter: `Bearer <token>`
- All requests automatically include token

### Try Out Endpoints
- Click **Try it out** on any endpoint
- Modify request body/parameters
- Click **Execute**
- View response immediately

### Request/Response Examples
- Swagger shows example request bodies
- Response schemas displayed
- HTTP status codes documented

### Filter by Tag
- Click on controller names to expand/collapse
- Focus on specific API groups

---

## Common Testing Scenarios

### Scenario 1: Complete User Journey

1. Register USER
2. Authenticate with USER token
3. Register child
4. View policies
5. Create policy application
6. Switch to ADMIN token
7. Approve application
8. Switch to USER token
9. Make premium payment
10. View payment history

### Scenario 2: Admin Operations

1. Register ADMIN
2. Authenticate with ADMIN token
3. Create new policy
4. View all applications
5. Approve/reject applications
6. View all claims
7. Process claims
8. View dashboard metrics

### Scenario 3: Data Verification

1. Perform operations in Swagger
2. Open H2 Console
3. Query tables to verify data
4. Check relationships
5. Validate business logic

---

## Troubleshooting

### Issue: Token Expired
**Solution**: Register/login again to get new token (24-hour expiry)

### Issue: 403 Forbidden
**Solution**: Check if correct role token is used (USER vs ADMIN)

### Issue: Database locked
**Solution**: Close H2 Console before running application

### Issue: Data not persisting
**Solution**: Check `spring.jpa.hibernate.ddl-auto=update` in application.properties

### Issue: Swagger not loading
**Solution**: Verify URL is http://localhost:9090/swagger-ui.html

---

## API Endpoint Summary

### Public Endpoints (No Auth)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/policies
- GET /api/policies/{id}

### User Endpoints (USER Role)
- GET /api/users/me
- PUT /api/users/me
- POST /api/children
- GET /api/children/my
- POST /api/policy-applications
- GET /api/policy-applications/my
- POST /api/premium-payments
- GET /api/premium-payments/my
- POST /api/claims
- GET /api/claims/my

### Admin Endpoints (ADMIN Role)
- POST /api/admin/policies
- PUT /api/admin/policies/{id}
- GET /api/admin/policy-applications
- PUT /api/admin/policy-applications/{id}/approve
- PUT /api/admin/policy-applications/{id}/reject
- GET /api/admin/claims
- PUT /api/admin/claims/{id}/approve
- PUT /api/admin/claims/{id}/reject
- GET /api/admin/dashboard

---

## Best Practices

1. **Always authenticate first** - Get token before testing protected endpoints
2. **Use correct role** - USER for customer operations, ADMIN for management
3. **Check H2 Console** - Verify data after operations
4. **Test complete workflows** - Don't test endpoints in isolation
5. **Monitor console logs** - SQL queries visible with show-sql=true
6. **Save test data** - Database persists, build test scenarios incrementally

---

## Quick Reference

| Resource | URL |
|----------|-----|
| Application | http://localhost:9090 |
| Swagger UI | http://localhost:9090/swagger-ui.html |
| API Docs | http://localhost:9090/v3/api-docs |
| H2 Console | http://localhost:9090/h2-console |
| Database File | ./data/child_insurance_db.mv.db |

**Default Credentials:**
- H2 Username: `sa`
- H2 Password: `Praveen@12`

**JWT Token:**
- Expiry: 24 hours
- Format: `Bearer <token>`
- Header: `Authorization`

---

Happy Testing! 🚀
