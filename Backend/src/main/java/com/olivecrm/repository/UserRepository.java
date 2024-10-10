package com.olivecrm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.olivecrm.entity.Employee;

@Repository
public interface UserRepository extends JpaRepository<Employee, Long> {
    // Check if an employee with a specific username exists
    boolean existsByUsername(String username);

    // Find an employee by username
    Optional<Employee> findByUsername(String username);

    // Delete an employee by username
    void deleteByUsername(String username);
}