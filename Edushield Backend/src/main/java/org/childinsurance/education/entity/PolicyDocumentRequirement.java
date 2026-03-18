package org.childinsurance.education.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "policy_document_requirement")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PolicyDocumentRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "policy_id", nullable = false)
    private Policy policy;

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "stage", nullable = false)
    private String stage; // APPLICATION or CLAIM
}
