package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Role Repository for role management
 */
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Find role by name
     * @param roleName the name of the role
     * @return Optional containing the role if found
     */
    Optional<Role> findByRoleName(String roleName);
}

