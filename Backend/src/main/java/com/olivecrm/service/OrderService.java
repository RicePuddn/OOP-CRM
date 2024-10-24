package com.olivecrm.service;

import com.olivecrm.dto.CustomerSegmentDTO;
import com.olivecrm.dto.ProductPurchaseHistoryDTO;
import com.olivecrm.dto.TopProductDTO;
import com.olivecrm.entity.Order;
import com.olivecrm.enums.CustomerSegmentType;
import com.olivecrm.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private OrderRepository orderRepository;

    public static class SalesMetrics {
        private long totalSales;
        private double totalAmount;
        private double averageOrderValue;

        public SalesMetrics(List<Order> orders) {
            this.totalSales = orders.size();
            this.totalAmount = orders.stream()
                    .mapToDouble(Order::getTotalCost)
                    .sum();
            this.averageOrderValue = totalSales > 0 ? totalAmount / totalSales : 0;
        }

        public long getTotalSales() {
            return totalSales;
        }

        public double getTotalAmount() {
            return totalAmount;
        }

        public double getAverageOrderValue() {
            return averageOrderValue;
        }
    }

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public List<TopProductDTO> getTopThreeMostPurchasedProducts(Integer customerId) {
        List<Order> orders = orderRepository.findAllByCustomer_cID(customerId);
        return orders.stream()
                .collect(Collectors.groupingBy(order -> order.getProduct().getProductName(),
                        Collectors.summingLong(Order::getQuantity)))
                .entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(3)
                .map(entry -> new TopProductDTO(entry.getKey(), entry.getValue()))
                .collect(Collectors.toList());
    }

    public ProductPurchaseHistoryDTO getCustomerPurchaseHistory(Integer customerId) {
        List<Order> orders = orderRepository.findAllByCustomer_cID(customerId);
        logger.info("Number of orders fetched: {}", orders.size());
        orders.forEach(order -> {
            logger.info("Order ID: {}, Quantity: {}, Sales Date: {}", 
                order.getId(), order.getQuantity(), order.getSalesDate());
        });

        ProductPurchaseHistoryDTO purchaseHistoryDTO = new ProductPurchaseHistoryDTO();

        List<Integer> quantities = orders.stream()
                .map(Order::getQuantity)
                .collect(Collectors.toList());

        List<LocalDate> salesDates = orders.stream()
                .map(Order::getSalesDate)
                .collect(Collectors.toList());

        purchaseHistoryDTO.setPurchaseCounts(quantities);
        purchaseHistoryDTO.setPurchaseDates(
                salesDates.stream().map(LocalDate::toString).collect(Collectors.toList()));

        return purchaseHistoryDTO;
    }

    public Page<Order> getOrdersByFilters(
            Integer customerId,
            String salesType,
            Double totalCost,
            LocalDate singleDate,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        return orderRepository.findByFilters(customerId, salesType, totalCost, singleDate, startDate, endDate, pageable);
    }

    // Metrics methods
    public SalesMetrics getMetrics(Integer customerId, String salesType, Double totalCost, LocalDate startDate, LocalDate endDate) {
        logger.info("Getting metrics with parameters - customerId: {}, salesType: {}, totalCost: {}, startDate: {}, endDate: {}", 
                   customerId, salesType, totalCost, startDate, endDate);

        // Get all orders without pagination for metrics calculation
        Page<Order> filteredOrders = getOrdersByFilters(customerId, salesType, totalCost, null, startDate, endDate, Pageable.unpaged());
        List<Order> orders = filteredOrders.getContent();
        
        logger.info("Found {} orders for metrics calculation", orders.size());
        
        return new SalesMetrics(orders);
    }

    // Recency-based segmentation
    public CustomerSegmentDTO getActiveCustomers() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        List<Integer> customerIds = orderRepository.findActiveCustomers(thirtyDaysAgo);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.ACTIVE.getLabel(),
                CustomerSegmentType.ACTIVE.getCategory());
    }

    public CustomerSegmentDTO getDormantCustomers() {
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        List<Integer> customerIds = orderRepository.findDormantCustomers(sixMonthsAgo);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.DORMANT.getLabel(),
                CustomerSegmentType.DORMANT.getCategory());
    }

    public CustomerSegmentDTO getReturningCustomers() {
        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        LocalDate twoYearsAgo = LocalDate.now().minusYears(2);
        List<Integer> customerIds = orderRepository.findReturningCustomers(oneYearAgo, twoYearsAgo);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.RETURNING.getLabel(),
                CustomerSegmentType.RETURNING.getCategory());
    }

    // Frequency-based segmentation
    public CustomerSegmentDTO getFrequentCustomers() {
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        List<Integer> customerIds = orderRepository.findFrequentCustomers(monthStart);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.FREQUENT.getLabel(),
                CustomerSegmentType.FREQUENT.getCategory());
    }

    public CustomerSegmentDTO getOccasionalCustomers() {
        LocalDate quarterStart = LocalDate.now().minusMonths(3);
        List<Integer> customerIds = orderRepository.findOccasionalCustomers(quarterStart);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.OCCASIONAL.getLabel(),
                CustomerSegmentType.OCCASIONAL.getCategory());
    }

    public CustomerSegmentDTO getOneTimeCustomers() {
        List<Integer> customerIds = orderRepository.findOneTimeCustomers();
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.ONE_TIME.getLabel(),
                CustomerSegmentType.ONE_TIME.getCategory());
    }

    // Monetary-based segmentation
    public List<CustomerSegmentDTO> getMonetarySegments() {
        List<Object[]> customerSpending = orderRepository.getCustomerTotalSpending();

        // Sort customers by spending
        List<Integer> sortedCustomers = customerSpending.stream()
                .sorted((a, b) -> ((Double) b[1]).compareTo((Double) a[1]))
                .map(arr -> (Integer) arr[0])
                .collect(Collectors.toList());

        int totalCustomers = sortedCustomers.size();
        int topTenPercent = (int) (totalCustomers * 0.1);
        int bottomTwentyPercent = (int) (totalCustomers * 0.2);

        List<CustomerSegmentDTO> segments = new ArrayList<>();

        // High-Value (top 10%)
        segments.add(new CustomerSegmentDTO(
                sortedCustomers.subList(0, topTenPercent),
                CustomerSegmentType.HIGH_VALUE.getLabel(),
                CustomerSegmentType.HIGH_VALUE.getCategory()));

        // Mid-Tier (10%-80%)
        segments.add(new CustomerSegmentDTO(
                sortedCustomers.subList(topTenPercent, totalCustomers - bottomTwentyPercent),
                CustomerSegmentType.MID_TIER.getLabel(),
                CustomerSegmentType.MID_TIER.getCategory()));

        // Low-Spend (bottom 20%)
        segments.add(new CustomerSegmentDTO(
                sortedCustomers.subList(totalCustomers - bottomTwentyPercent, totalCustomers),
                CustomerSegmentType.LOW_SPEND.getLabel(),
                CustomerSegmentType.LOW_SPEND.getCategory()));

        return segments;
    }
}
