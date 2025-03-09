package com.hairdresser.my_spring_project.repository;

import com.hairdresser.my_spring_project.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByRefreshToken(String refreshToken);
    boolean existsByUsername(String username);
}
