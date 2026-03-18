package org.childinsurance.education.service;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.dto.child.ChildRequest;
import org.childinsurance.education.dto.child.ChildResponse;
import org.childinsurance.education.entity.Child;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.ChildRepository;
import org.childinsurance.education.repository.UserRepository;
import org.childinsurance.education.security.SecurityUtils;
import org.childinsurance.education.service.ChildService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Child Service Implementation
 */
@Service
@AllArgsConstructor
@Slf4j
@Transactional
public class ChildServiceImpl implements ChildService {

    private final ChildRepository childRepository;
    private final UserRepository userRepository;

    @Override
    public ChildResponse addChild(ChildRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Adding child for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with ID: {}", userId);
                    return new RuntimeException("User not found");
                });

        Child child = Child.builder()
                .childName(request.getChildName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .schoolName(request.getSchoolName())
                .educationGoal(request.getEducationGoal())
                .user(user)
                .build();

        Child savedChild = childRepository.save(child);
        log.info("Child added successfully with ID: {}", savedChild.getChildId());

        return mapToResponse(savedChild);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ChildResponse> getAllChildren(Pageable pageable) {
        Long userId = SecurityUtils.getCurrentUserId();
        log.info("Fetching all children for user ID: {}", userId);

        return childRepository.findByUserUserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ChildResponse getChildById(Long childId) {
        log.info("Fetching child with ID: {}", childId);

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> {
                    log.error("Child not found with ID: {}", childId);
                    return new RuntimeException("Child not found");
                });

        return mapToResponse(child);
    }

    @Override
    public ChildResponse updateChild(Long childId, ChildRequest request) {
        log.info("Updating child with ID: {}", childId);

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> {
                    log.error("Child not found with ID: {}", childId);
                    return new RuntimeException("Child not found");
                });

        child.setChildName(request.getChildName());
        child.setDateOfBirth(request.getDateOfBirth());
        child.setGender(request.getGender());
        child.setSchoolName(request.getSchoolName());
        child.setEducationGoal(request.getEducationGoal());

        Child updatedChild = childRepository.save(child);
        log.info("Child updated successfully");

        return mapToResponse(updatedChild);
    }

    @Override
    public void deleteChild(Long childId) {
        log.info("Deleting child with ID: {}", childId);

        Child child = childRepository.findById(childId)
                .orElseThrow(() -> {
                    log.error("Child not found with ID: {}", childId);
                    throw new RuntimeException("Child not found");
                });

        childRepository.delete(child);
        log.info("Child deleted successfully");
    }

    /**
     * Map Child entity to ChildResponse DTO
     */
    private ChildResponse mapToResponse(Child child) {
        return ChildResponse.builder()
                .childId(child.getChildId())
                .childName(child.getChildName())
                .dateOfBirth(child.getDateOfBirth())
                .gender(child.getGender())
                .schoolName(child.getSchoolName())
                .educationGoal(child.getEducationGoal())
                .userId(child.getUser().getUserId())
                .build();
    }
}

