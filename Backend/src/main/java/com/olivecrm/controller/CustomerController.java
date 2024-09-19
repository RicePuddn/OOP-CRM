package com.olivecrm.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @GetMapping("/")
    public List<Customer> getAllCustomers() {
        // Logic to fetch and return all customers
    }

    @PostMapping("/")
    public Customer createCustomer(@RequestBody Customer customer) {
        // Logic to create a new customer
        return customer;
    }

    @GetMapping("/{id}")
    public Customer getCustomer(@PathVariable Long id) {
        // Logic to fetch and return a specific customer
        Customer testCustomer = new Customer();
        return testCustomer;
    }

    // More endpoints as needed...
}