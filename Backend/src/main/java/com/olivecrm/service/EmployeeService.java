package com.olivecrm.service;

import java.time.LocalDateTime;
import java.util.List;
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

    // LIST EMPLOYEE
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // CREATE EMPLOYEE
    public Employee createUser(String username, String first_name, String last_name, String rawPassword, Role role)
        throws Exception {
        // Check if user already exists
        if (employeeRepository.existsByUsername(username)) {
            throw new Exception("Username already exists!");
        }

        // Create new employee
        Employee employee = new Employee();
        employee.setUsername(username);
        employee.setFirst_name(first_name);
        employee.setLast_name(last_name);
        employee.setPassword(PasswordUtil.hashPassword(rawPassword)); // Encrypt password

        if (role == Role.ADMIN) {
            throw new Exception("You have no permission to create an admin account.");
        }
        employee.setRole(role);

        employee.setStatus(Employee.Status.ACTIVE);

        return employeeRepository.save(employee); // Save the new user to the database
    }


    // UPDATE EMPLOYEE
    public Employee updateUser(Long id, String newUsername, String first_name, String last_name, String password, Role role) throws Exception {
        Optional<Employee> optionalUser = employeeRepository.findById(id);
        if (optionalUser.isPresent()) {
            Employee employee = optionalUser.get();

            if (employee.getRole() == Role.ADMIN) {
                throw new Exception("You have no permission to update another admin's account.");
            }

            // Update the username (primary key) if a new one is provided
            if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(employee.getUsername())) {
                if (employeeRepository.existsByUsername(newUsername)) {
                    throw new Exception("Username is already taken");
                }
                employee.setUsername(newUsername);
            }
            if (first_name != null && !first_name.isEmpty()) {
                employee.setFirst_name(first_name);
            }
            if (last_name != null && !last_name.isEmpty()) {
                employee.setLast_name(last_name);
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

    // DELETE EMPLOYEE
    @Transactional
    public void deleteUser(Long id) throws Exception {
        Optional<Employee> optionalUser = employeeRepository.findById(id);
        if (optionalUser.isPresent()) {
            Employee employee = optionalUser.get();

            if (employee.getRole() == Role.ADMIN) {
                throw new Exception("You have no permission to delete another admin's account.");
            }

            employeeRepository.deleteById(id); // Delete the user
        } else {
            throw new Exception("User not found");
        }
    }

    // EMPLOYEE LOGIN
    public Employee login(String username, String password) {
        Optional<Employee> employeeOptional = employeeRepository.findByUsername(username);

        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            System.out.println("Employee found: " + employee.getUsername());

            // Check if the user's account is suspended
            if (employee.getStatus() == Employee.Status.SUSPENDED) {
                throw new RuntimeException("User account is suspended. Please contact admin.");
            }

            boolean matchPassword = PasswordUtil.checkPassword(password, employee.getPassword());

            if (matchPassword) {
                System.out.println("Password matched for user: " + employee.getUsername());
                employee.setLastLogin(LocalDateTime.now());
                employeeRepository.save(employee);
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

    // Method to update user status
    public Employee updateUserStatus(Long id, Employee.Status newStatus) throws Exception {
        Optional<Employee> employeeOptional = employeeRepository.findById(id);

        if (!employeeOptional.isPresent()) {
            throw new Exception("Employee with ID " + id + " not found");
        }

        Employee employee = employeeOptional.get();
        employee.setStatus(newStatus);
        return employeeRepository.save(employee);
    }
}