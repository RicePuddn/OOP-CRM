package com.olivecrm.controller;

import com.olivecrm.dto.LoginRequest;
import com.olivecrm.entity.Employee;
import com.olivecrm.service.loginService; // Corrected the class name to follow conventions
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private loginService loginService;

    @PostMapping("/login") // Changed to POST
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Employee employee = loginService.login(loginRequest.getUsername(), loginRequest.getPassword());
            // You can create and return a JWT token or session information here
            return ResponseEntity.ok(employee); // Or return relevant info such as a token
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }
}
