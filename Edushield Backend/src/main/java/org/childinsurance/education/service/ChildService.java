package org.childinsurance.education.service;

import org.childinsurance.education.dto.child.ChildRequest;
import org.childinsurance.education.dto.child.ChildResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Child Service Interface
 */
public interface ChildService {
    /**
     * Add new child
     */
    ChildResponse addChild(ChildRequest request);

    /**
     * Get all children of logged-in user
     */
    Page<ChildResponse> getAllChildren(Pageable pageable);

    /**
     * Get child by ID
     */
    ChildResponse getChildById(Long childId);

    /**
     * Update child details
     */
    ChildResponse updateChild(Long childId, ChildRequest request);

    /**
     * Delete child
     */
    void deleteChild(Long childId);
}

