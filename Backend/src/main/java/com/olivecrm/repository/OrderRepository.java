package com.olivecrm.repository;

import com.olivecrm.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer_cID(int customerId); // Ensure this matches the getter method name in Customer

    List<Order> findBySalesType(String salesType);

    List<Order> findBySalesDate(LocalDate salesDate);

    List<Order> findByTotalCost(Double totalCost);

    @Query("SELECT o FROM Order o WHERE (:customerId IS NULL OR o.customer.cID = :customerId) " +
           "AND (:salesType IS NULL OR o.salesType = :salesType) " +
           "AND (:salesDate IS NULL OR o.salesDate = :salesDate) " +
           "AND (:totalCost IS NULL OR o.totalCost = :totalCost)")
    List<Order> findByFilters(
            @Param("customerId") Integer customerId,
            @Param("salesType") String salesType,
            @Param("salesDate") LocalDate salesDate,
            @Param("totalCost") Double totalCost,
            Pageable pageable // Added Pageable for pagination
    );
}
