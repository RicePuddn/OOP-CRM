package com.olivecrm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.olivecrm.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Check if an employee with a specific username exists
    boolean existsByUsername(String username);

    // Find an employee by username
    Optional<User> findByUsername(String username);

    // Delete an employee by username
    void deleteByUsername(String username);
}