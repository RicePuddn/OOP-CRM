package com.olivecrm.controller;

import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Order>> getFilteredOrders(
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double minTotalCost,
            @RequestParam(required = false) Double maxTotalCost,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {
        try {
            logger.info("Received filter request with parameters: customerId={}, salesType={}, minTotalCost={}, maxTotalCost={}, startDate={}, endDate={}, pageable={}",
                    customerId, salesType, minTotalCost, maxTotalCost, startDate, endDate, pageable);
            
            Page<Order> filteredOrders = orderService.getFilteredOrders(customerId, salesType, minTotalCost, maxTotalCost, startDate, endDate, pageable);
            
            logger.info("Filtered orders retrieved successfully. Total elements: {}, Total pages: {}", 
                    filteredOrders.getTotalElements(), filteredOrders.getTotalPages());
            
            return ResponseEntity.ok(filteredOrders);
        } catch (Exception e) {
            logger.error("Error while filtering orders", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }
}
