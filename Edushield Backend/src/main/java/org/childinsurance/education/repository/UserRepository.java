package org.childinsurance.education.repository;

import org.childinsurance.education.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * User Repository for user management
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    /**
     * Find a user by email
     * @param email the email of the user
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Find all users with a specific role
     * @param roleName the name of the role
     * @return List of users with the specified role
     */
    @Query("SELECT u FROM User u WHERE u.role.roleName = :roleName")
    List<User> findByRoleName(@Param("roleName") String roleName);

    /**
     * Find a user by email and password (for login)
     * @param email the email of the user
     * @param password the password of the user
     * @return Optional containing the user if found
     */
    Optional<User> findByEmailAndPassword(String email, String password);

    /**
     * Check if a user exists by email
     * @param email the email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role.roleName = 'USER' OR u.role.roleName = 'ROLE_USER'")
    long countUsers();

    @Query("SELECT FORMATDATETIME(u.createdAt, 'yyyy-MM') as month, COUNT(u) FROM User u GROUP BY month ORDER BY month ASC")
    List<Object[]> findUserGrowth();
}
