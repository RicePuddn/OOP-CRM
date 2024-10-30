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
                        "(:#{#productIds == null} = true OR o.product.pID IN (:productIds)) AND " +
                        "(:singleDate IS NULL OR o.salesDate = :singleDate) AND " +
                        "((:startDate IS NULL AND :endDate IS NULL) OR " +
                        "(o.salesDate >= :startDate AND o.salesDate <= :endDate))")
        Page<Order> findByFilters(
                        @Param("customerId") Integer customerId,
                        @Param("salesType") String salesType,
                        @Param("totalCost") Double totalCost,
                        @Param("singleDate") LocalDate singleDate,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        // Recency Queries
        @Query("SELECT DISTINCT o.customer.cID FROM Order o WHERE o.salesDate >= :thirtyDaysAgo")
        List<Integer> findActiveCustomers(@Param("thirtyDaysAgo") LocalDate thirtyDaysAgo);

        @Query("SELECT DISTINCT o.customer.cID FROM Order o WHERE o.salesDate <= :sixMonthsAgo")
        List<Integer> findDormantCustomers(@Param("sixMonthsAgo") LocalDate sixMonthsAgo);

        @Query("SELECT DISTINCT o.customer.cID FROM Order o WHERE o.salesDate <= :oneYearAgo AND o.salesDate > :twoYearsAgo")
        List<Integer> findReturningCustomers(
                        @Param("oneYearAgo") LocalDate oneYearAgo,
                        @Param("twoYearsAgo") LocalDate twoYearsAgo);

        // Frequency Queries
        @Query("SELECT o.customer.cID FROM Order o WHERE o.salesDate >= :startDate GROUP BY o.customer.cID HAVING COUNT(o) > 10")
        List<Integer> findFrequentCustomers(@Param("startDate") LocalDate startDate);

        @Query("SELECT o.customer.cID FROM Order o WHERE o.salesDate >= :startDate GROUP BY o.customer.cID HAVING COUNT(o) BETWEEN 3 AND 5")
        List<Integer> findOccasionalCustomers(@Param("startDate") LocalDate startDate);

        @Query("SELECT o.customer.cID FROM Order o GROUP BY o.customer.cID HAVING COUNT(o) = 1")
        List<Integer> findOneTimeCustomers();

        // Monetary Value Queries
        @Query("SELECT o.customer.cID FROM Order o GROUP BY o.customer.cID ORDER BY SUM(o.totalCost) DESC")
        List<Integer> findCustomersByTotalSpending();

        @Query("SELECT o.customer.cID, SUM(o.totalCost) as total FROM Order o GROUP BY o.customer.cID")
        List<Object[]> getCustomerTotalSpending();

        // Method to find all orders by customer ID
        @Query("SELECT o FROM Order o WHERE o.customer.cID = :customerId")
        List<Order> findAllByCustomer_cID(@Param("customerId") Integer customerId);

}
