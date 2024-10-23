package com.olivecrm.service;

import com.olivecrm.entity.Order;
import com.olivecrm.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

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

    public List<Order> getOrdersByCustomerId(int customerId) {
        return orderRepository.findByCustomer_cID(customerId);
    }

    public List<Order> getOrdersBySalesType(String salesType) {
        return orderRepository.findBySalesType(salesType);
    }

    public List<Order> getOrdersBySalesDateRange(LocalDate startDate, LocalDate endDate) {
        return orderRepository.findBySalesDateBetween(startDate, endDate);
    }

    public List<Order> getOrdersByTotalCost(Double totalCost) {
        return orderRepository.findByTotalCost(totalCost);
    }

    public Page<Order> getOrdersByFilters(Integer customerId, String salesType, Double totalCost, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        logger.info("Filtering orders with parameters - customerId: {}, salesType: {}, totalCost: {}, startDate: {}, endDate: {}", 
                   customerId, salesType, totalCost, startDate, endDate);
        
        Page<Order> result = orderRepository.findByFilters(customerId, salesType, totalCost, startDate, endDate, pageable);
        logger.info("Found {} orders matching filters", result.getTotalElements());
        
        return result;
    }

    // New methods for metrics
    public SalesMetrics getMetrics(Integer customerId, String salesType, Double totalCost, LocalDate startDate, LocalDate endDate) {
        logger.info("Getting metrics with parameters - customerId: {}, salesType: {}, totalCost: {}, startDate: {}, endDate: {}", 
                   customerId, salesType, totalCost, startDate, endDate);

        // Get all orders without pagination for metrics calculation
        Page<Order> filteredOrders = getOrdersByFilters(customerId, salesType, totalCost, startDate, endDate, Pageable.unpaged());
        List<Order> orders = filteredOrders.getContent();
        
        logger.info("Found {} orders for metrics calculation", orders.size());
        
        return new SalesMetrics(orders);
    }

    public SalesMetrics getCustomerMetrics(int customerId) {
        List<Order> customerOrders = getOrdersByCustomerId(customerId);
        return new SalesMetrics(customerOrders);
    }

    public SalesMetrics getSalesTypeMetrics(String salesType) {
        List<Order> salesTypeOrders = getOrdersBySalesType(salesType);
        return new SalesMetrics(salesTypeOrders);
    }

    public SalesMetrics getDateRangeMetrics(LocalDate startDate, LocalDate endDate) {
        List<Order> dateRangeOrders = getOrdersBySalesDateRange(startDate, endDate);
        return new SalesMetrics(dateRangeOrders);
    }
}
