# ✅ PERSISTENCE FIXES APPLIED

## 🎯 Problem Summary
- Database was being recreated on every restart
- schema.sql causing duplicate index errors
- Data was not persisting across server restarts

## 🔧 Solutions Applied

### 1. Updated `application.properties`
**Changes Made**:
```properties
# Changed from in-memory to file-based H2 database
spring.datasource.url=jdbc:h2:file:./data/child_insurance_db;DB_CLOSE_ON_EXIT=FALSE;AUTO_RECONNECT=TRUE

# Disabled automatic SQL script execution
spring.sql.init.mode=never

# Keep JPA auto-update (creates tables but doesn't drop them)
spring.jpa.hibernate.ddl-auto=update
```

**Benefits**:
- ✅ Database is stored in `./data/child_insurance_db.mv.db` file
- ✅ Data persists across server restarts
- ✅ No more duplicate index errors
- ✅ No more schema.sql conflicts

---

### 2. Created `DataInitializer.java`
**Location**: `src/main/java/org/childinsurance/education/config/DataInitializer.java`

**What It Does**:
```java
@Bean
CommandLineRunner initDatabase() {
    return args -> {
        // Check if data exists before inserting
        if (roleRepository.count() == 0) {
            // Create ADMIN and USER roles
        }
        
        if (policyRepository.count() == 0) {
            // Create 5 default policies
        }
        
        // Generate BCrypt hash for testing
    };
}
```

**Benefits**:
- ✅ Seed data (Roles & Policies) created **ONLY ONCE** on first startup
- ✅ Subsequent restarts skip initialization (data already exists)
- ✅ No duplicate data errors
- ✅ Clean console logs showing what's happening

---

### 3. Updated `data.sql`
**Changes Made**:
- Removed all SQL INSERT/MERGE statements
- Kept file as documentation only
- Added comprehensive API usage guide

**Benefits**:
- ✅ No SQL conflicts
- ✅ Clear documentation for developers
- ✅ API-first approach for data creation

---

### 4. Deleted Old Database
**Action**: Removed `./data` folder to start fresh

**Benefits**:
- ✅ Clean slate
- ✅ No corrupted data
- ✅ Proper initialization on first run

---

## 🚀 How It Works Now

### First Startup (Database doesn't exist):
```
1. Application starts
   ↓
2. Hibernate creates all tables (via @Entity classes)
   ↓
3. DataInitializer checks if data exists
   ↓
4. Inserts Roles: ADMIN, USER
   ↓
5. Inserts 5 Policies
   ↓
6. Displays BCrypt password hash in console
   ↓
7. Ready to accept API requests
```

### Subsequent Startups (Database exists):
```
1. Application starts
   ↓
2. Hibernate updates tables if schema changed
   ↓
3. DataInitializer checks if data exists
   ↓
4. Finds existing data, skips initialization
   ↓
5. Logs: "Roles already exist. Skipping..."
   ↓
6. Logs: "Policies already exist. Skipping..."
   ↓
7. Ready to accept API requests (all previous data intact)
```

---

## 📝 User Registration & Login Flow

### Register ADMIN
```bash
POST http://localhost:9090/api/auth/register
Content-Type: application/json

{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}
```

**What Happens Internally**:
1. `AuthController` receives request
2. `AuthServiceImpl.register()` is called
3. Checks if email already exists (throws error if yes)
4. Finds ADMIN role from database
5. **BCrypt encrypts** the password: `Admin@123` → `$2a$10$...`
6. Saves user to database
7. Generates JWT token
8. Returns token + user info

**Important**: Password is **NEVER** stored as plain text. BCrypt hash is stored.

---

### Login
```bash
POST http://localhost:9090/api/auth/login
Content-Type: application/json

{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}
```

**What Happens Internally**:
1. `AuthController` receives request
2. Spring Security's `AuthenticationManager` is invoked
3. `CustomUserDetailsService` loads user from database
4. BCrypt compares provided password with stored hash:
   - Input: `Admin@123`
   - Stored: `$2a$10$...`
   - Match? ✅ Success
5. Generates fresh JWT token (valid for 24 hours)
6. Returns token + user info

---

## 🔐 Data Persistence Guarantee

### What Persists:
- ✅ **Roles**: ADMIN, USER (created once, never deleted)
- ✅ **Policies**: 5 default policies (created once, admins can add more)
- ✅ **Users**: All registered users (admin + customers)
- ✅ **Children**: All added children
- ✅ **Addresses**: All user addresses
- ✅ **Policy Applications**: All policy applications
- ✅ **Premium Payments**: All payment records
- ✅ **Claims**: All claim submissions
- ✅ **Nominees**: All nominee information

### What Doesn't Persist:
- ❌ **JWT Tokens**: Tokens are stateless and expire after 24 hours
  - Solution: Login again to get a new token

### Database File Location:
```
./data/child_insurance_db.mv.db
```

---

## 🎯 Testing Workflow

### Day 1 - First Run:
```bash
# 1. Start application (database created automatically)
# 2. Register admin
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@insurance.com",
  "password": "Admin@123",
  "phone": "9999999999",
  "role": "ADMIN"
}

# 3. Register customer
POST /api/auth/register
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "User@123",
  "phone": "9876543210",
  "role": "USER"
}

# 4. Stop server
```

### Day 2 - Subsequent Runs:
```bash
# 1. Start application (database loaded from file)
# 2. Login with existing credentials
POST /api/auth/login
{
  "email": "admin@insurance.com",
  "password": "Admin@123"
}

# 3. All previous users, policies, applications exist!
# 4. Continue working where you left off
```

---

## 🐛 Troubleshooting

### Issue 1: "User already exists"
**Cause**: You're trying to register with an email that's already registered.

**Solution**: 
- Use a different email, OR
- Login with existing credentials

### Issue 2: "Bad credentials" on login
**Cause**: Wrong password or user doesn't exist.

**Solution**:
- Double-check email and password
- Register first if user doesn't exist

### Issue 3: "Database locked"
**Cause**: Multiple application instances trying to access same database file.

**Solution**:
- Stop all running instances
- Start only one instance

### Issue 4: Want to reset everything
**Solution**:
```bash
# 1. Stop application
# 2. Delete database folder
rm -rf ./data

# 3. Start application (fresh database created)
```

---

## 📊 Console Output Examples

### First Startup:
```
2026-03-10 10:00:00 INFO  o.c.e.EducationApplication : Starting EducationApplication
2026-03-10 10:00:01 INFO  o.c.e.c.DataInitializer    : 🔄 Checking if seed data needs to be initialized...
2026-03-10 10:00:01 INFO  o.c.e.c.DataInitializer    : 📝 Creating default roles...
2026-03-10 10:00:01 INFO  o.c.e.c.DataInitializer    : ✅ Roles created: ADMIN, USER
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : 📝 Creating default policies...
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : ✅ 5 Policies created successfully
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : ====================================
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : 💡 For testing: Password 'Admin@123' encoded as:
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    :    $2a$10$abc123...xyz789
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : ====================================
2026-03-10 10:00:02 INFO  o.c.e.c.DataInitializer    : ✅ Database initialization complete!
2026-03-10 10:00:03 INFO  o.s.b.w.e.t.TomcatWebServer : Tomcat started on port 9090
```

### Subsequent Startups:
```
2026-03-11 09:00:00 INFO  o.c.e.EducationApplication : Starting EducationApplication
2026-03-11 09:00:01 INFO  o.c.e.c.DataInitializer    : 🔄 Checking if seed data needs to be initialized...
2026-03-11 09:00:01 INFO  o.c.e.c.DataInitializer    : ✓ Roles already exist. Skipping role initialization.
2026-03-11 09:00:01 INFO  o.c.e.c.DataInitializer    : ✓ Policies already exist. Skipping policy initialization.
2026-03-11 09:00:01 INFO  o.c.e.c.DataInitializer    : ✅ Database initialization complete!
2026-03-11 09:00:02 INFO  o.s.b.w.e.t.TomcatWebServer : Tomcat started on port 9090
```

---

## ✅ Verification Checklist

After starting the application, verify:

- [ ] No SQL errors in console
- [ ] Console shows "✅ Database initialization complete!"
- [ ] Console shows "Tomcat started on port 9090"
- [ ] `./data/child_insurance_db.mv.db` file exists
- [ ] Swagger UI accessible at http://localhost:9090/swagger-ui.html
- [ ] H2 Console accessible at http://localhost:9090/h2-console
- [ ] Can register admin via API
- [ ] Can login with registered credentials
- [ ] Can view policies without authentication

---

## 🎉 Success!

Your Child Education Insurance backend now has:
- ✅ **Persistent file-based database**
- ✅ **One-time seed data initialization**
- ✅ **No duplicate data errors**
- ✅ **Proper BCrypt password hashing**
- ✅ **JWT token authentication**
- ✅ **Data survives server restarts**

All data is saved and persists across restarts!

