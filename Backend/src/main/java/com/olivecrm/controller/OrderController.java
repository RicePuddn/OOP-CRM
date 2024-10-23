package com.olivecrm.controller;

import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
import com.olivecrm.service.OrderService.SalesMetrics;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/by-date-range")
    public ResponseEntity<List<Order>> getOrdersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        LocalDate start = LocalDate.parse(startDate.trim(), DATE_FORMATTER);
        LocalDate end = LocalDate.parse(endDate.trim(), DATE_FORMATTER);
        logger.info("Getting orders for date range: {} to {}", start, end);
        List<Order> orders = orderService.getOrdersBySalesDateRange(start, end);
        logger.info("Found {} orders in date range", orders.size());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Order>> getOrdersByFilters(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double totalCost,
            @RequestParam(required = false) String dateFilterType,
            @RequestParam(required = false) String singleDate,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            Pageable pageable) {

        Page<Order> orders;
        if ("single".equals(dateFilterType) && singleDate != null) {
            LocalDate date = LocalDate.parse(singleDate.trim(), DATE_FORMATTER);
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, date, date, pageable);
        } else if ("range".equals(dateFilterType) && startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate.trim(), DATE_FORMATTER);
            LocalDate end = LocalDate.parse(endDate.trim(), DATE_FORMATTER);
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, start, end, pageable);
        } else {
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, null, pageable);
        }

        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/metrics")
    public ResponseEntity<SalesMetrics> getMetrics(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double totalCost,
            @RequestParam(required = false) String dateFilterType,
            @RequestParam(required = false) String singleDate,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        logger.info("Getting metrics with parameters - customerId: {}, salesType: {}, totalCost: {}, dateFilterType: {}, singleDate: {}, startDate: {}, endDate: {}", 
                   customerId, salesType, totalCost, dateFilterType, singleDate, startDate, endDate);

        LocalDate effectiveStartDate = null;
        LocalDate effectiveEndDate = null;

        try {
            if ("single".equals(dateFilterType) && singleDate != null) {
                effectiveStartDate = LocalDate.parse(singleDate.trim(), DATE_FORMATTER);
                effectiveEndDate = effectiveStartDate;
                logger.info("Using single date filter: {}", effectiveStartDate);
            } else if ("range".equals(dateFilterType) && startDate != null && endDate != null) {
                effectiveStartDate = LocalDate.parse(startDate.trim(), DATE_FORMATTER);
                effectiveEndDate = LocalDate.parse(endDate.trim(), DATE_FORMATTER);
                logger.info("Using date range filter: {} to {}", effectiveStartDate, effectiveEndDate);
            }
        } catch (Exception e) {
            logger.error("Error parsing dates: {}", e.getMessage());
            throw new IllegalArgumentException("Invalid date format. Please use yyyy-MM-dd format.");
        }

        SalesMetrics metrics = orderService.getMetrics(customerId, salesType, totalCost, effectiveStartDate, effectiveEndDate);
        
        logger.info("Metrics result - totalSales: {}, totalAmount: {}, averageOrderValue: {}", 
                   metrics.getTotalSales(), metrics.getTotalAmount(), metrics.getAverageOrderValue());
        
        return ResponseEntity.ok(metrics);
    }
}
