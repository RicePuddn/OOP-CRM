package com.olivecrm.service;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Employee.Role;
import com.olivecrm.repository.UserRepository;
import com.olivecrm.util.PasswordUtil;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE USER
    public Employee createUser(String username, String firstName, String lastName, String rawPassword, Role role) throws Exception {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new Exception("Username already exists!");
        }
        // Create new user
        Employee employee = new Employee();
        employee.setUsername(username);
        employee.setFirstName(firstName);
        employee.setLastName(lastName);
        employee.setPassword(PasswordUtil.hashPassword(rawPassword));  // Encrypt password
        employee.setRole(role);
        
        return userRepository.save(employee);  // Save the new user to the database
    }

    // UPDATE USER
    public Employee updateUser(String username, String firstName, String lastName, String password, Role role) throws Exception {
        Optional<Employee> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            Employee employee = optionalUser.get();

            if (employee.getRole() == Role.ADMIN) {
                throw new Exception("You  have no permission to update another admin's account.");
            }
            
            // Only update fields that are provided
            if (username != null && !username.isEmpty()) {
                employee.setUsername(username);
            }
            if (firstName != null && !firstName.isEmpty()) {
                employee.setFirstName(firstName);
            }
            if (lastName != null && !lastName.isEmpty()) {
                employee.setLastName(lastName);
            }
            if (password != null && !password.isEmpty()) {
                employee.setPassword(PasswordUtil.hashPassword(password)); // Only update password if provided
            }
            if (role != null) {
                employee.setRole(role);
            }

            return userRepository.save(employee); // Save the updated user
        } else {
            throw new Exception("User not found");
        }
    }

    // DELETE USER
    @Transactional
    public void deleteUser(String username) throws Exception {
        Optional<Employee> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            userRepository.deleteByUsername(username); // Delete the user
        } else {
            throw new Exception("User not found");
        }
    }
}