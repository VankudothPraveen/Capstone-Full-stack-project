package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Child;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Child Repository for child management
 */
@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {
    /**
     * Find all children of a specific user
     * @param userId the ID of the user
     * @return List of children belonging to that user
     */
    List<Child> findByUserUserId(Long userId);

    /**
     * Find all children of a specific user with pagination
     * @param userId the ID of the user
     * @param pageable pagination info
     * @return Page of children belonging to that user
     */
    Page<Child> findByUserUserId(Long userId, Pageable pageable);

    /**
     * Find children by name
     * @param childName the name of the child
     * @return List of children with that name
     */
    List<Child> findByChildName(String childName);

    /**
     * Find children by gender
     * @param gender the gender of the child
     * @return List of children with that gender
     */
    List<Child> findByGender(String gender);

    /**
     * Find children by date of birth
     * @param dateOfBirth the date of birth
     * @return List of children born on that date
     */
    List<Child> findByDateOfBirth(LocalDate dateOfBirth);

    /**
     * Find children born between two dates
     * @param startDate the start date
     * @param endDate the end date
     * @return List of children born between the dates
     */
    @Query("SELECT c FROM Child c WHERE c.dateOfBirth BETWEEN :startDate AND :endDate")
    List<Child> findChildrenBornBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * Count children of a specific user
     * @param userId the ID of the user
     * @return Number of children for that user
     */
    long countByUserUserId(Long userId);
}

