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

        @Query("SELECT DISTINCT o FROM Order o WHERE " +
                        "(:customerId IS NULL OR o.customer.cID = :customerId) AND " +
                        "(:salesType IS NULL OR o.salesType = :salesType) AND " +
                        "(:#{#productIds == null} = true OR o.product.pID IN (:productIds)) AND " +
                        "(:singleDate IS NULL OR o.salesDate = :singleDate) AND " +
                        "((:startDate IS NULL AND :endDate IS NULL) OR " +
                        "(o.salesDate >= :startDate AND o.salesDate <= :endDate))")
        Page<Order> findByFilters(
                        @Param("customerId") Integer customerId,
                        @Param("salesType") String salesType,
                        @Param("productIds") List<Integer> productIds,
                        @Param("singleDate") LocalDate singleDate,
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        Pageable pageable);

        // Get the most recent order date
        @Query("SELECT MAX(o.salesDate) FROM Order o")
        LocalDate findMostRecentOrderDate();

        // Recency Queries
        @Query("SELECT DISTINCT o.customer.cID FROM Order o " +
           "WHERE o.salesDate >= :thirtyDaysAgo " +
           "AND o.salesDate <= :referenceDate")
       List<Integer> findActiveCustomers(
              @Param("thirtyDaysAgo") LocalDate thirtyDaysAgo,
              @Param("referenceDate") LocalDate referenceDate);

       @Query("SELECT DISTINCT c.cID FROM Order o " +
              "JOIN o.customer c " +
              "GROUP BY c.cID " +
              "HAVING COUNT(o) > 1 " +  // More than one order
              "AND MAX(o.salesDate) <= :referenceDate " +  // Up to reference date
              "AND MAX(o.salesDate) >= :oneYearAgo")  // At least one order in last year
       List<Integer> findReturningCustomers(
              @Param("oneYearAgo") LocalDate oneYearAgo,
              @Param("referenceDate") LocalDate referenceDate
       );

       // Updated query to get all customers with purchases up to reference date
       @Query("SELECT DISTINCT o.customer.cID FROM Order o WHERE o.salesDate <= :referenceDate")
       List<Integer> findAllCustomersWithPurchases(@Param("referenceDate") LocalDate referenceDate);


        // Updated Frequency Queries for lifetime analysis
        @Query("SELECT DISTINCT c.cID FROM Order o1 " +
               "JOIN o1.customer c " +
               "WHERE EXISTS (" +
               "  SELECT 1 FROM Order o2 " +
               "  WHERE o2.customer = o1.customer " +
               "  GROUP BY o2.customer, FUNCTION('DATE_FORMAT', o2.salesDate, '%Y-%m') " +
               "  HAVING COUNT(o2) > 10" +
               ")")
        List<Integer> findFrequentCustomers();

        @Query("SELECT DISTINCT c.cID FROM Order o1 " +
               "JOIN o1.customer c " +
               "WHERE EXISTS (" +
               "  SELECT 1 FROM Order o2 " +
               "  WHERE o2.customer = o1.customer " +
               "  GROUP BY o2.customer, " +
               "    FUNCTION('YEAR', o2.salesDate), " +
               "    FUNCTION('QUARTER', o2.salesDate) " +
               "  HAVING COUNT(o2) BETWEEN 3 AND 5" +
               ")")
        List<Integer> findOccasionalCustomers();

        @Query("SELECT o.customer.cID FROM Order o " +
               "GROUP BY o.customer.cID " +
               "HAVING COUNT(o) = 1")
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
