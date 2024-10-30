package com.olivecrm.service;

import com.olivecrm.entity.Customer;
import com.olivecrm.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Service method to retrieve all customers with their IDs and zip codes
    public List<Customer> getAllCustomersWithZipcodes() {
        return customerRepository.findAll();
    }
}
