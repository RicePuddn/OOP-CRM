package com.olivecrm.controller;

import com.olivecrm.dto.EmployeeDTO;
import com.olivecrm.entity.Employee;
import com.olivecrm.service.EmployeeService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {

    @Autowired private EmployeeService employeeService;

    // LIST EMPLOYEE
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    // CREATE EMPLOYEE
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody EmployeeDTO userDTO) {
        try {
            Employee.Role userRole = mapRole(userDTO.getRole());
            Employee newUser = employeeService.createUser(
                userDTO.getUsername(), userDTO.getFirst_name(),
                userDTO.getLast_name(), userDTO.getPassword(), userRole);
            return ResponseEntity.ok(newUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid role: " +
                                                    userDTO.getRole());
        } catch (Exception e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // UPDATE EMPLOYEE
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,
                                        @RequestBody EmployeeDTO userDTO) {
        try {
            // Only map the role if it is provided, otherwise pass null
            Employee.Role userRole =
                userDTO.getRole() != null ? mapRole(userDTO.getRole()) : null;

            Employee updateUser = employeeService.updateUser(
                id, userDTO.getUsername(), userDTO.getFirst_name(), userDTO.getLast_name(),
                userDTO.getPassword(), userRole);
            return ResponseEntity.ok(updateUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE EMPLOYEE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            employeeService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully!");
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

    // EMPLOYEE LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody EmployeeDTO loginRequest) {
        try {
            Employee employee = employeeService.login(
                loginRequest.getUsername(), loginRequest.getPassword());
            // You can create and return a JWT token or session information here
            return ResponseEntity.ok(
                employee); // Or return relevant info such as a token
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
        }
    }
}
