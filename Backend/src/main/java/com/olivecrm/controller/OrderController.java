package com.olivecrm.controller;

import com.olivecrm.dto.CustomerSegmentDTO;
import com.olivecrm.dto.OrderCreateDTO;
import com.olivecrm.dto.ProductPurchaseHistoryDTO;
import com.olivecrm.dto.TopProductDTO;
import com.olivecrm.entity.Order;
import com.olivecrm.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.util.List;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    @Autowired
    private OrderService orderService;

    @PostMapping("/manual")
    public ResponseEntity<Order> createManualOrder(@RequestBody OrderCreateDTO orderDTO) {
        logger.info("Received manual order creation request");
        try {
            Order createdOrder = orderService.createOrder(orderDTO);
            logger.info("Successfully created manual order with ID: {}", createdOrder.getId());
            return ResponseEntity.ok(createdOrder);
        } catch (Exception e) {
            logger.error("Error creating manual order", e);
            return ResponseEntity.badRequest().build();
        }
    }

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

    @GetMapping("/export/csv")
    public ResponseEntity<byte[]> exportOrdersToCSV(
            @RequestParam(required = false) Integer customerId,
            @RequestParam(required = false) String salesType,
            @RequestParam(required = false) Double totalCost,
            @RequestParam(required = false) String dateFilterType,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate singleDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {

        logger.info("Received CSV export request with filters");

        try {
            // Get all orders matching the filters (without pagination)
            Page<Order> orders;
            if ("single".equals(dateFilterType) && singleDate != null) {
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, singleDate, null, null,
                        Pageable.unpaged());
            } else if ("range".equals(dateFilterType) && startDate != null && endDate != null) {
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, startDate, endDate,
                        Pageable.unpaged());
            } else {
                orders = orderService.getOrdersByFilters(customerId, salesType, totalCost, null, null, null,
                        Pageable.unpaged());
            }

            // Build CSV content
            StringBuilder csvContent = new StringBuilder();
            // Add CSV header
            csvContent.append(
                    "Order ID,Customer ID,Product ID,Quantity,Total Cost,Order Method,Sales Date,Sales Type,Shipping Method\n");

            // Add data rows
            for (Order order : orders.getContent()) {
                csvContent.append(String.format("%d,%d,%d,%d,%.2f,%s,%s,%s,%s\n",
                    order.getId(),
                    order.getCustomer().getCID(),
                    order.getProduct().getPID(),
                    order.getQuantity(),
                    order.getTotalCost(),
                    order.getOrderMethod(),
                    order.getSalesDate(),
                    order.getSalesType(),
                    order.getShippingMethod()
                ));
            }

            // Prepare the response
            byte[] csvBytes = csvContent.toString().getBytes(StandardCharsets.UTF_8);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "orders_export.csv");
            headers.setContentLength(csvBytes.length);

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .body(csvBytes);

        } catch (Exception e) {
            logger.error("Error exporting orders to CSV", e);
            throw e;
        }
    }

    // Customer Segmentation Endpoints
    @GetMapping("/segments/recency")
    public ResponseEntity<List<CustomerSegmentDTO>> getRecencySegments() {
        logger.info("Fetching recency-based customer segments");
        try {
            // Get returning customers first to ensure they're properly identified
            CustomerSegmentDTO returningCustomers = orderService.getReturningCustomers();
            CustomerSegmentDTO activeCustomers = orderService.getActiveCustomers();
            CustomerSegmentDTO dormantCustomers = orderService.getDormantCustomers();
            
            List<CustomerSegmentDTO> segments = List.of(
                activeCustomers,
                returningCustomers,
                dormantCustomers
            );
            
            logger.info("Found {} active, {} returning, and {} dormant customers",
                activeCustomers.getCustomerCount(),
                returningCustomers.getCustomerCount(),
                dormantCustomers.getCustomerCount());
                
            return ResponseEntity.ok(segments);
        } catch (Exception e) {
            logger.error("Error fetching recency segments", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/segments/frequency")
    public ResponseEntity<List<CustomerSegmentDTO>> getFrequencySegments() {
        logger.info("Fetching frequency-based customer segments");
        try {
            List<CustomerSegmentDTO> segments = List.of(
                orderService.getFrequentCustomers(),
                orderService.getOccasionalCustomers(),
                orderService.getOneTimeCustomers()
            );
            return ResponseEntity.ok(segments);
        } catch (Exception e) {
            logger.error("Error fetching frequency segments", e);
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/segments/monetary")
    public ResponseEntity<List<CustomerSegmentDTO>> getMonetarySegments() {
        logger.info("Fetching monetary-based customer segments");
        try {
            return ResponseEntity.ok(orderService.getMonetarySegments());
        } catch (Exception e) {
            logger.error("Error fetching monetary segments", e);
            return ResponseEntity.status(500).build();
        }
    }
}
