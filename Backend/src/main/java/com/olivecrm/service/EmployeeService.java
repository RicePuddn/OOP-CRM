package com.olivecrm.service;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Employee.Role;
import com.olivecrm.repository.EmployeeRepository;
import com.olivecrm.util.PasswordUtil;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    // CREATE USER
    public Employee createUser(String username, String first_name, String last_name, String rawPassword, Role role)
            throws Exception {
        // Check if user already exists
        if (employeeRepository.existsByUsername(username)) {
            throw new Exception("Username already exists!");
        }
        // Create new user
        Employee employee = new Employee();
        employee.setUsername(username);
        employee.setFirstName(first_name);
        employee.setLastName(last_name);
        employee.setPassword(PasswordUtil.hashPassword(rawPassword)); // Encrypt password
        employee.setRole(role);

        return employeeRepository.save(employee); // Save the new user to the database
    }

    // UPDATE USER
    public Employee updateUser(String username, String first_name, String last_name, String password, Role role)
            throws Exception {
        Optional<Employee> optionalUser = employeeRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            Employee employee = optionalUser.get();

            if (employee.getRole() == Role.ADMIN) {
                throw new Exception("You  have no permission to update another admin's account.");
            }

            // Only update fields that are provided
            if (username != null && !username.isEmpty()) {
                employee.setUsername(username);
            }
            if (first_name != null && !first_name.isEmpty()) {
                employee.setFirstName(first_name);
            }
            if (last_name != null && !last_name.isEmpty()) {
                employee.setLastName(last_name);
            }
            if (password != null && !password.isEmpty()) {
                employee.setPassword(PasswordUtil.hashPassword(password)); // Only update password if provided
            }
            if (role != null) {
                employee.setRole(role);
            }

            return employeeRepository.save(employee); // Save the updated user
        } else {
            throw new Exception("User not found");
        }
    }

    // DELETE USER
    @Transactional
    public void deleteUser(String username) throws Exception {
        Optional<Employee> optionalUser = employeeRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            employeeRepository.deleteByUsername(username); // Delete the user
        } else {
            throw new Exception("User not found");
        }
    }

    // LOGIN
    public Employee login(String username, String password) {
        Optional<Employee> employeeOptional = employeeRepository.findByUsername(username);

        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            System.out.println("Employee found: " + employee.getUsername());

            boolean matchPassword = PasswordUtil.checkPassword(password, employee.getPassword());

            if (matchPassword) {
                System.out.println("Password matched for user: " + employee.getUsername());
                return employee;
            } else {
                System.out.println("Password mismatch for user: " + employee.getUsername());
                throw new RuntimeException("Invalid password");
            }
        } else {
            System.out.println("No employee found with username: " + username);
            throw new RuntimeException("Invalid username");
        }
    }
}