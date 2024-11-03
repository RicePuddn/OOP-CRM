package com.olivecrm.repository;

import com.olivecrm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    @Query("SELECT MAX(c.cID) FROM Customer c")
    Optional<Integer> findMaxCustomerId();
}
