package com.olivecrm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.olivecrm.dto.EmployeeDTO;
import com.olivecrm.entity.Employee;
import com.olivecrm.dto.EmployeeDTO.Role;
import com.olivecrm.service.EmployeeService;

@RestController
@RequestMapping("/api/employee")
public class UserController {

    @Autowired
    private EmployeeService employeeService;

    // CREATE USER
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody EmployeeDTO userDTO) {
        try {
            // Assuming userDTO.getRole() returns a String like "USER" or "ADMIN"
            Employee.Role userRole = mapRole(userDTO.getRole());
            Employee newUser = employeeService.createUser(
                    userDTO.getUsername(),
                    userDTO.getFirstName(),
                    userDTO.getLastName(),
                    userDTO.getPassword(),
                    userRole);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " + userDTO.getRole());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE USER
    @PutMapping("/update/{username}")
    public ResponseEntity<?> updateUser(@PathVariable String username, @RequestBody EmployeeDTO userDTO) {
        try {
            Employee.Role userRole = mapRole(userDTO.getRole());
            Employee updateUser = employeeService.updateUser(username, userDTO.getFirstName(), userDTO.getLastName(),
                    userDTO.getPassword(), userRole);
            return ResponseEntity.ok(updateUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE USER
    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        try {
            employeeService.deleteUser(username);
            return ResponseEntity.ok("User " + username + " deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Method to map UserDTO.Role to User.Role
    private Employee.Role mapRole(EmployeeDTO.Role role) {
        switch (role) {
            case ADMIN:
                return Employee.Role.ADMIN;
            case MARKETING:
                return Employee.Role.MARKETING;
            case SALES:
                return Employee.Role.SALES;
            default:
                throw new IllegalArgumentException("Invalid role: " + role);
        }
    }

    // Login Service
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EmployeeDTO loginRequest) {
        try {
            Employee employee = employeeService.login(loginRequest.getUsername(), loginRequest.getPassword());
            // You can create and return a JWT token or session information here
            return ResponseEntity.ok(employee); // Or return relevant info such as a token
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

}
