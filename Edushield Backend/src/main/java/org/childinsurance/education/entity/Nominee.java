package org.childinsurance.education.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Table(name = "nominee")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Nominee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "nominee_id")
    private Long nomineeId;

    @Column(name = "nominee_name", nullable = false)
    private String nomineeName;

    @Column(name = "relationship", nullable = false)
    private String relationship;

    @Column(name = "phone", nullable = false)
    private String phone;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private PolicyApplication policyApplication;
}
