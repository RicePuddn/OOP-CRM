package com.olivecrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.olivecrm.entity.Newsletter;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Integer> {
    // Find all newsletters (inherited from JpaRepository, no need to declare it)
    
    // Find newsletters by the username of the employee who created them
    List<Newsletter> findByCreatedBy_Username(String username); 
}
