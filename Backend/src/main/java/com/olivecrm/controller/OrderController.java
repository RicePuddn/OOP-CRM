package com.olivecrm.controller;

import com.olivecrm.dto.CustomerSegmentDTO;
import com.olivecrm.dto.ProductPurchaseHistoryDTO;
import com.olivecrm.dto.TopProductDTO;
import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<Order>> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/customer/{customerId}/top-products")
    public ResponseEntity<List<TopProductDTO>> getTopThreeProducts(@PathVariable Integer customerId) {
        logger.info("Fetching top three most purchased products for customer ID: {}", customerId);
        try {
            List<TopProductDTO> topProducts = orderService.getTopThreeMostPurchasedProducts(customerId);
            if (topProducts.isEmpty()) {
                logger.info("No products found for customer ID: {}", customerId);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(topProducts);
        } catch (Exception e) {
            logger.error("Error fetching top products for customer ID: {}", customerId, e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/customer/{customerId}/purchase-history")
    public ResponseEntity<ProductPurchaseHistoryDTO> getCustomerPurchaseHistory(
            @PathVariable Integer customerId) {
        logger.info("Fetching purchase history for customer ID: {}", customerId);
        try {
            ProductPurchaseHistoryDTO purchaseHistory = orderService.getCustomerPurchaseHistory(customerId);
            if (purchaseHistory.getPurchaseCounts().isEmpty()) {
                logger.info("No purchase history found for customer ID: {}", customerId);
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(purchaseHistory);
        } catch (Exception e) {
            logger.error("Error fetching purchase history for customer ID: {}", customerId, e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<Page<Order>> getOrdersByFilters(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double totalCost,
            @RequestParam(required = false) String dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate singleDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,
            Pageable pageable) {

        logger.info("Received filter request - dateFilterType: {}, singleDate: {}, startDate: {}, endDate: {}",
                dateFilterType, singleDate, startDate, endDate);

        Page<Order> orders;
        try {
            if ("single".equals(dateFilterType) && singleDate != null) {
                logger.info("Applying single date filter for date: {}", singleDate);
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, singleDate, null, null,
                        pageable);
            } else if ("range".equals(dateFilterType) && startDate != null && endDate != null) {
                logger.info("Applying date range filter from {} to {}", startDate, endDate);
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, startDate, endDate,
                        pageable);
            } else {
                logger.info("No date filtering applied");
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, null, null, pageable);
            }

            logger.info("Filter query returned {} results", orders.getContent().size());

            if (orders.isEmpty()) {
                logger.info("No orders found matching the filters");
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error processing filter request", e);
            throw e;
        }
    }

    // Customer Segmentation Endpoints

    @GetMapping("/segments/recency/active")
    public ResponseEntity<CustomerSegmentDTO> getActiveCustomers() {
        return ResponseEntity.ok(orderService.getActiveCustomers());
    }

    @GetMapping("/segments/recency/dormant")
    public ResponseEntity<CustomerSegmentDTO> getDormantCustomers() {
        return ResponseEntity.ok(orderService.getDormantCustomers());
    }

    @GetMapping("/segments/recency/returning")
    public ResponseEntity<CustomerSegmentDTO> getReturningCustomers() {
        return ResponseEntity.ok(orderService.getReturningCustomers());
    }

    @GetMapping("/segments/frequency/frequent")
    public ResponseEntity<CustomerSegmentDTO> getFrequentCustomers() {
        return ResponseEntity.ok(orderService.getFrequentCustomers());
    }

    @GetMapping("/segments/frequency/occasional")
    public ResponseEntity<CustomerSegmentDTO> getOccasionalCustomers() {
        return ResponseEntity.ok(orderService.getOccasionalCustomers());
    }

    @GetMapping("/segments/frequency/one-time")
    public ResponseEntity<CustomerSegmentDTO> getOneTimeCustomers() {
        return ResponseEntity.ok(orderService.getOneTimeCustomers());
    }

    @GetMapping("/segments/monetary")
    public ResponseEntity<List<CustomerSegmentDTO>> getMonetarySegments() {
        return ResponseEntity.ok(orderService.getMonetarySegments());
    }

}
