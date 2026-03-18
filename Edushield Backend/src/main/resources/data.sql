-- Seed Roles (with duplicate check)
MERGE INTO roles (role_name) KEY(role_name) VALUES ('ADMIN');
MERGE INTO roles (role_name) KEY(role_name) VALUES ('USER');

-- No pre-seeded admin user
-- Register admin via POST /api/auth/register with role: "ADMIN"

-- Seed Policies (with duplicate check)
MERGE INTO policy (policy_id, policy_name, base_premium, duration_years, bonus_percentage, risk_coverage_amount, min_child_age, max_child_age, maturity_benefit_amount, death_benefit_multiplier, waiver_of_premium, is_active, description) 
KEY(policy_id) VALUES (1, 'BrightFuture Plan', 5000.00, 10, 15.50, 1000000.00, 0, 10, 500000.00, 2.0, true, true, 'Comprehensive education plan for school-going children');

MERGE INTO policy (policy_id, policy_name, base_premium, duration_years, bonus_percentage, risk_coverage_amount, min_child_age, max_child_age, maturity_benefit_amount, death_benefit_multiplier, waiver_of_premium, is_active, description) 
KEY(policy_id) VALUES (2, 'ScholarSecure Plan', 8000.00, 15, 20.00, 2000000.00, 5, 15, 1000000.00, 2.5, true, true, 'Higher education plan with enhanced benefits');

MERGE INTO policy (policy_id, policy_name, base_premium, duration_years, bonus_percentage, risk_coverage_amount, min_child_age, max_child_age, maturity_benefit_amount, death_benefit_multiplier, waiver_of_premium, is_active, description) 
KEY(policy_id) VALUES (3, 'DreamAchiever Plan', 12000.00, 18, 25.00, 3000000.00, 0, 12, 1500000.00, 3.0, true, true, 'Premium plan for complete education coverage');

MERGE INTO policy (policy_id, policy_name, base_premium, duration_years, bonus_percentage, risk_coverage_amount, min_child_age, max_child_age, maturity_benefit_amount, death_benefit_multiplier, waiver_of_premium, is_active, description) 
KEY(policy_id) VALUES (4, 'Comprehensive Education Plan', 10000.00, 18, 22.50, 2500000.00, 3, 14, 1250000.00, 2.5, true, true, 'Balanced plan for long-term education goals');

MERGE INTO policy (policy_id, policy_name, base_premium, duration_years, bonus_percentage, risk_coverage_amount, min_child_age, max_child_age, maturity_benefit_amount, death_benefit_multiplier, waiver_of_premium, is_active, description) 
KEY(policy_id) VALUES (5, 'Basic Education Coverage', 3000.00, 8, 10.00, 500000.00, 0, 8, 250000.00, 1.5, true, true, 'Affordable basic education insurance');

-- Seed Policy Document Requirements
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (1, 1, 'Birth Certificate', 'APPLICATION');
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (2, 1, 'Parent ID Proof', 'APPLICATION');
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (3, 1, 'School Admission Letter', 'CLAIM');

MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (4, 2, 'Previous Year Marksheet', 'APPLICATION');
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (5, 2, 'College Fee Receipt', 'CLAIM');

MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (6, 3, 'Income Proof', 'APPLICATION');
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (7, 3, 'Study Certificate', 'APPLICATION');

MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (8, 4, 'Aadhar Card', 'APPLICATION');
MERGE INTO policy_document_requirement (id, policy_id, document_type, stage) KEY(id) VALUES (9, 4, 'Medical Certificate', 'CLAIM');

-- ============================================================
-- HOW TO CREATE USERS AND AUTHENTICATE:
-- ============================================================
--
-- STEP 1: Register as ADMIN
-- =============================
-- POST /api/auth/register
-- Content-Type: application/json
--
-- {
--   "name": "System Administrator",
--   "email": "admin@insurance.com",
--   "password": "AdminPassword123",
--   "phone": "9999999999",
--   "role": "ADMIN"
-- }
--
-- Response:
-- {
--   "success": true,
--   "message": "User registered successfully",
--   "data": {
--     "success": true,
--     "token": "eyJhbGciOiJIUzUxMiJ9...",
--     "tokenType": "Bearer",
--     "user": {
--       "userId": 1,
--       "name": "System Administrator",
--       "email": "admin@insurance.com",
--       "role": "ADMIN"
--     }
--   }
-- }
--
-- ============================================================
--
-- STEP 2: Register as USER (Customer)
-- =============================
-- POST /api/auth/register
-- Content-Type: application/json
--
-- {
--   "name": "Rajesh Kumar",
--   "email": "rajesh.kumar@example.com",
--   "password": "SecurePassword123",
--   "phone": "9876543210",
--   "role": "USER"
-- }
--
-- Response:
-- {
--   "success": true,
--   "message": "User registered successfully",
--   "data": {
--     "success": true,
--     "token": "eyJhbGciOiJIUzUxMiJ9...",
--     "tokenType": "Bearer",
--     "user": {
--       "userId": 2,
--       "name": "Rajesh Kumar",
--       "email": "rajesh.kumar@example.com",
--       "role": "USER"
--     }
--   }
-- }
--
-- ============================================================
--
-- STEP 3: Login with credentials
-- =============================
-- POST /api/auth/login
-- Content-Type: application/json
--
-- {
--   "email": "admin@insurance.com",
--   "password": "AdminPassword123"
-- }
--
-- Response:
-- {
--   "success": true,
--   "message": "Login successful",
--   "data": {
--     "success": true,
--     "token": "eyJhbGciOiJIUzUxMiJ9...",
--     "tokenType": "Bearer",
--     "user": {
--       "userId": 1,
--       "name": "System Administrator",
--       "email": "admin@insurance.com",
--       "role": "ADMIN"
--     }
--   }
-- }
--
-- ============================================================
--
-- STEP 4: Use JWT token in authenticated requests
-- =============================
-- All subsequent requests (except /api/auth/register and GET /api/policies)
-- must include the JWT token in the Authorization header:
--
-- Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
--
-- Example: Get user profile
-- GET /api/users/me
-- Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
--
-- Response:
-- {
--   "success": true,
--   "message": "User profile retrieved successfully",
--   "data": {
--     "userId": 1,
--     "name": "System Administrator",
--     "email": "admin@insurance.com",
--     "phone": "9999999999",
--     "role": "ADMIN",
--     "createdAt": "2026-02-25T10:30:00"
--   }
-- }
--
-- ============================================================
--
-- TESTING WORKFLOW:
-- =============================
-- 1. Application starts
-- 2. schema.sql creates all tables
-- 3. data.sql inserts:
--    - 2 roles (ADMIN, USER)
--    - 5 policies (available to all)
-- 4. Use POST /api/auth/register to create users
-- 5. Use POST /api/auth/login to get JWT token
-- 6. Use JWT token in Authorization header for protected endpoints
-- 7. Use GET /api/policies (no auth needed) to see available policies
-- 8. Use POST /api/policy-applications to apply for policies
-- 9. Use POST /api/premium-payments to make payments
-- 10. Use POST /api/claims to file claims
--
-- ============================================================

-- ============================================================
-- END OF SEED DATA
-- ============================================================

