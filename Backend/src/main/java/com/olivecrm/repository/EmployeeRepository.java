// src/main/java/com/olivecrm/repository/EmployeeRepository.java
package com.olivecrm.repository;

import com.olivecrm.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    // Find an employee by username
    Optional<Employee> findByUsername(String username);

    // Check if an employee with a specific username exists
    boolean existsByUsername(String username);
}
