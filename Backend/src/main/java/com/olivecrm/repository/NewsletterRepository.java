package com.olivecrm.repository;

import com.olivecrm.entity.Newsletter;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NewsletterRepository
    extends JpaRepository<Newsletter, Integer> {

    List<Newsletter> findByCreatedBy_Id(int id);

    List<Newsletter> findByCreatedBy_Username(String username);

    Optional<Newsletter> findByTitle(String title);

    List<Newsletter> findByTarget(String target);

    Page<Newsletter> findByTarget(String target, Pageable pageable);

    boolean existsByTitle(String title);
}
