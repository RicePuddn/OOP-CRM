package com.olivecrm.controller;

import com.olivecrm.entity.Customer;
import com.olivecrm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    // Endpoint to retrieve all customers with their zip codes
    @GetMapping("/zipcodes")
    public ResponseEntity<List<Customer>> getAllCustomersWithZipcodes() {
        List<Customer> customers = customerService.getAllCustomersWithZipcodes();
        if (customers.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(customers);
    }
}
