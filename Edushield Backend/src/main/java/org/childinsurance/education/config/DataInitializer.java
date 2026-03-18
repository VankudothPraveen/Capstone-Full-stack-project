package org.childinsurance.education.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.childinsurance.education.entity.Role;
import org.childinsurance.education.entity.User;
import org.childinsurance.education.repository.RoleRepository;
import org.childinsurance.education.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    @Order(1)
    public CommandLineRunner initRoles() {
        return args -> {
            try {
                log.info("====== Initializing Roles ======");
                
                if (roleRepository.count() == 0) {
                    Role adminRole = new Role();
                    adminRole.setRoleName("ADMIN");
                    roleRepository.save(adminRole);
                    
                    Role userRole = new Role();
                    userRole.setRoleName("USER");
                    roleRepository.save(userRole);
                    
                    Role underwriterRole = new Role();
                    underwriterRole.setRoleName("UNDERWRITER");
                    roleRepository.save(underwriterRole);
                    
                    Role claimsOfficerRole = new Role();
                    claimsOfficerRole.setRoleName("CLAIMS_OFFICER");
                    roleRepository.save(claimsOfficerRole);
                    
                    log.info("✓ Roles created: ADMIN, USER, UNDERWRITER, CLAIMS_OFFICER");
                } else {
                    // Seed missing roles if required
                    if (roleRepository.findByRoleName("ADMIN").isEmpty()) {
                        Role adminRole = new Role();
                        adminRole.setRoleName("ADMIN");
                        roleRepository.save(adminRole);
                        log.info("✓ Role created: ADMIN");
                    }
                    if (roleRepository.findByRoleName("USER").isEmpty()) {
                        Role userRole = new Role();
                        userRole.setRoleName("USER");
                        roleRepository.save(userRole);
                        log.info("✓ Role created: USER");
                    }
                    if (roleRepository.findByRoleName("UNDERWRITER").isEmpty()) {
                        Role underwriterRole = new Role();
                        underwriterRole.setRoleName("UNDERWRITER");
                        roleRepository.save(underwriterRole);
                        log.info("✓ Role created: UNDERWRITER");
                    }
                    if (roleRepository.findByRoleName("CLAIMS_OFFICER").isEmpty()) {
                        Role claimsOfficerRole = new Role();
                        claimsOfficerRole.setRoleName("CLAIMS_OFFICER");
                        roleRepository.save(claimsOfficerRole);
                        log.info("✓ Role created: CLAIMS_OFFICER");
                    }
                    log.info("✓ Roles verification complete");
                }
            } catch (Exception e) {
                log.error("Error initializing roles", e);
            }
        };
    }

    @Bean
    @Order(2)
    public CommandLineRunner initAdminUser() {
        return args -> {
            try {
                log.info("====== Initializing Admin User ======");
                
                // Check if admin user already exists
                if (userRepository.findByEmail("admin@demo.com").isPresent()) {
                    log.info("✓ Admin user already exists");
                    return;
                }

                // Get ADMIN role
                Role adminRole = roleRepository.findByRoleName("ADMIN")
                        .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

                // Create admin user
                User adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setEmail("admin@demo.com");
                adminUser.setPassword(passwordEncoder.encode("Admin@123"));
                adminUser.setPhone("9123456780");
                adminUser.setRole(adminRole);
                adminUser.setCreatedAt(LocalDateTime.now());

                userRepository.save(adminUser);
                log.info("✓ Admin user created successfully!");
                log.info("  Email: admin@demo.com");
                log.info("  Password: Admin@123");

            } catch (Exception e) {
                log.error("Error initializing admin user", e);
            }
        };
    }

    @Bean
    @Order(3)
    public CommandLineRunner initUnderwriterUser() {
        return args -> {
            try {
                if (userRepository.findByEmail("underwriter@demo.com").isPresent()) {
                    return;
                }

                Role role = roleRepository.findByRoleName("UNDERWRITER")
                        .orElseThrow(() -> new RuntimeException("UNDERWRITER role not found"));

                User user = new User();
                user.setName("Underwriter User");
                user.setEmail("underwriter@demo.com");
                user.setPassword(passwordEncoder.encode("Underwriter@123"));
                user.setPhone("9123456781");
                user.setRole(role);
                user.setCreatedAt(LocalDateTime.now());

                userRepository.save(user);
                log.info("✓ Underwriter user created successfully!");
            } catch (Exception e) {
                log.error("Error initializing underwriter user", e);
            }
        };
    }

    @Bean
    @Order(4)
    public CommandLineRunner initClaimsOfficerUser() {
        return args -> {
            try {
                if (userRepository.findByEmail("claimsofficer@demo.com").isPresent()) {
                    return;
                }

                Role role = roleRepository.findByRoleName("CLAIMS_OFFICER")
                        .orElseThrow(() -> new RuntimeException("CLAIMS_OFFICER role not found"));

                User user = new User();
                user.setName("Claims Officer User");
                user.setEmail("claimsofficer@demo.com");
                user.setPassword(passwordEncoder.encode("ClaimsOfficer@123"));
                user.setPhone("9123456782");
                user.setRole(role);
                user.setCreatedAt(LocalDateTime.now());

                userRepository.save(user);
                log.info("✓ Claims Officer user created successfully!");
            } catch (Exception e) {
                log.error("Error initializing claims officer user", e);
            }
        };
    }
}
