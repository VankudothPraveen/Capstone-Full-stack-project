package org.childinsurance.education.repository;

import org.childinsurance.education.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Address Repository for address management
 */
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    /**
     * Find address by user ID
     * @param userId the ID of the user
     * @return Optional containing the address if found
     */
    Optional<Address> findByUserUserId(Long userId);

    /**
     * Find all addresses in a specific city
     * @param city the city name
     * @return List of addresses in that city
     */
    List<Address> findByCity(String city);

    /**
     * Find all addresses in a specific state
     * @param state the state name
     * @return List of addresses in that state
     */
    List<Address> findByState(String state);

    /**
     * Find address by city and state
     * @param city the city name
     * @param state the state name
     * @return List of addresses matching the criteria
     */
    List<Address> findByCityAndState(String city, String state);

    /**
     * Find address by pincode
     * @param pincode the postal code
     * @return List of addresses with that pincode
     */
    List<Address> findByPincode(String pincode);
}

