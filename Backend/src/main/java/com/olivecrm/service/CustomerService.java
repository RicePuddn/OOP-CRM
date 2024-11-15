package com.olivecrm.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.Customer;
import com.olivecrm.repository.CustomerRepository;

@Service
public class CustomerService {

    @Autowired private CustomerRepository customerRepository;

    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> findCustomerById(int cid) {
        return customerRepository.findCustomerById(cid);
    }

    public List<Customer> findCustomersByIds(List<Integer> customerIds) {
        return customerRepository.findAllById(customerIds);
    }

    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
}
