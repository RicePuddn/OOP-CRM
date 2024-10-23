package com.olivecrm.repository;

import com.olivecrm.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomer_cID(int customerId);

    List<Order> findBySalesType(String salesType);

    List<Order> findBySalesDateBetween(LocalDate startDate, LocalDate endDate);

    List<Order> findByTotalCost(Double totalCost);

    @Query("SELECT o FROM Order o WHERE " +
           "(:customerId IS NULL OR o.customer.cID = :customerId) AND " +
           "(:salesType IS NULL OR o.salesType = :salesType) AND " +
           "(:totalCost IS NULL OR o.totalCost = :totalCost) AND " +
           "(:startDate IS NULL OR o.salesDate >= :startDate) AND " +
           "(:endDate IS NULL OR o.salesDate <= :endDate)")
    Page<Order> findByFilters(
            @Param("customerId") Integer customerId,
            @Param("salesType") String salesType,
            @Param("totalCost") Double totalCost,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
