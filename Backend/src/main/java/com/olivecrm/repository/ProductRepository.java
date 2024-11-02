package com.olivecrm.repository;

import com.olivecrm.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    // Basic CRUD operations are provided by JpaRepository
}