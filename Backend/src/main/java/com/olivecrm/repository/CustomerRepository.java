package com.olivecrm.repository;

import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.olivecrm.entity.Customer;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("SELECT MAX(c.cID) FROM Customer c")
    Optional<Integer> findMaxCustomerId();

    @Query("SELECT c FROM Customer c WHERE c.cID = ?1")
    Optional<Customer> findCustomerById(Integer cID);

    @Modifying
    @Transactional
    @Query(
        "UPDATE Customer c SET c.first_name = ?1, c.last_name = ?2 WHERE c.cID = ?3")
    int
    updateCustomerName(String firstName, String lastName, Integer cID);
}
