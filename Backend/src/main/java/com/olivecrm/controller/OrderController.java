package com.olivecrm.controller;

import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // Endpoint to get all orders with pagination
    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    // Endpoint to get orders by customer ID
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Order>> getOrdersByCustomerId(@PathVariable("customerId") int customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    // Endpoint to get orders by sales type
    @GetMapping("/type/{salesType}")
    public ResponseEntity<List<Order>> getOrdersBySalesType(@PathVariable String salesType) {
        List<Order> orders = orderService.getOrdersBySalesType(salesType);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    // Endpoint to get orders by sales date
    @GetMapping("/date/{salesDate}")
    public ResponseEntity<List<Order>> getOrdersBySalesDate(@PathVariable String salesDate) {
        try {
            LocalDate date = LocalDate.parse(salesDate); // Assuming format is 'YYYY-MM-DD'
            List<Order> orders = orderService.getOrdersBySalesDate(date);
            if (orders.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body(null); // Return bad request if date format is invalid
        }
    }

    // Endpoint to get orders by total cost
    @GetMapping("/total_cost/{totalCost}")
    public ResponseEntity<List<Order>> getOrdersByTotalCost(@PathVariable Double totalCost) {
        List<Order> orders = orderService.getOrdersByTotalCost(totalCost);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }

    // Endpoint to get orders with various filters
    @GetMapping("/filter")
    public ResponseEntity<List<Order>> getOrdersByFilters(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) String salesDate,
            @RequestParam(required = false) Double totalCost,
            Pageable pageable) { // Added pageable for pagination

        LocalDate date = null;
        if (salesDate != null) {
            try {
                date = LocalDate.parse(salesDate);
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body(null); // Return bad request if date format is invalid
            }
        }

        // Retrieve orders based on filters and pagination
        List<Order> orders = orderService.getOrdersByFilters(customerId, salesType, date, totalCost, pageable);
        if (orders.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orders);
    }
}
