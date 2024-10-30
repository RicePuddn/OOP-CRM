package com.olivecrm.repository;

import com.olivecrm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    // No need to define findAll() explicitly, it is provided by JpaRepository
}
