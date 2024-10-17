package com.olivecrm.controller;

import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
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

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Order>> getOrdersByFilters(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double totalCost,
            @RequestParam(required = false) String dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate singleDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Pageable pageable) {

        Page<Order> orders;
        if ("single".equals(dateFilterType) && singleDate != null) {
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, singleDate, singleDate, pageable);
        } else if ("range".equals(dateFilterType) && startDate != null && endDate != null) {
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, startDate, endDate, pageable);
        } else {
            orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, null, pageable);
        }

        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }
}
