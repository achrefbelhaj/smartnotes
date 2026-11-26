package com.smartnotes.repository;

import com.smartnotes.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Spring Data génère automatiquement le code SQL à partir du nom des méthodes
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}