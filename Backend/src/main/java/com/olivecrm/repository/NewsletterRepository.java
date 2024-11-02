package com.olivecrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.olivecrm.entity.Newsletter;

@Repository
public interface NewsletterRepository
    extends JpaRepository<Newsletter, Integer> {

    List<Newsletter> findByCreatedBy_Id(long id);

    List<Newsletter> findByTitle(String title);

    List<Newsletter> findByTarget(String target);
}
