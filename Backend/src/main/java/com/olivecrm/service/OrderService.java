package com.olivecrm.service;

import com.olivecrm.dto.CustomerSegmentDTO;
import com.olivecrm.dto.OrderCreateDTO;
import com.olivecrm.dto.ProductPurchaseHistoryDTO;
import com.olivecrm.dto.TopProductDTO;
import com.olivecrm.entity.Customer;
import com.olivecrm.entity.Order;
import com.olivecrm.entity.Product;
import com.olivecrm.enums.CustomerSegmentType;
import com.olivecrm.repository.CustomerRepository;
import com.olivecrm.repository.OrderRepository;
import com.olivecrm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ProductRepository productRepository;

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

    public Order createOrder(OrderCreateDTO orderDTO) {
        Customer customer;

        // Try to find existing customer
        if (orderDTO.getCustomerId() != null) {
            customer = customerRepository.findById(orderDTO.getCustomerId())
                    .orElse(null);

            // Update existing customer if new details provided
            if (customer != null) {
                // Only update fields if they are provided and not empty
                if (orderDTO.getZipcode() != null && !orderDTO.getZipcode().trim().isEmpty()) {
                    customer.setZipcode(orderDTO.getZipcode());
                }
                if (orderDTO.getFirstName() != null && !orderDTO.getFirstName().trim().isEmpty()) {
                    customer.setFirst_name(orderDTO.getFirstName());
                }
                if (orderDTO.getLastName() != null && !orderDTO.getLastName().trim().isEmpty()) {
                    customer.setLast_name(orderDTO.getLastName());
                }
                customer = customerRepository.save(customer);
            }
        } else {
            customer = null;
        }

        // Create new customer if not found
        if (customer == null) {
            customer = new Customer();
            // Generate a new customer ID
            Integer newCustomerId = customerRepository.findMaxCustomerId().orElse(0) + 1;
            customer.setCID(newCustomerId);
            // Only set fields if they are provided and not empty
            if (orderDTO.getZipcode() != null && !orderDTO.getZipcode().trim().isEmpty()) {
                customer.setZipcode(orderDTO.getZipcode());
            }
            if (orderDTO.getFirstName() != null && !orderDTO.getFirstName().trim().isEmpty()) {
                customer.setFirst_name(orderDTO.getFirstName());
            }
            if (orderDTO.getLastName() != null && !orderDTO.getLastName().trim().isEmpty()) {
                customer.setLast_name(orderDTO.getLastName());
            }
            customer = customerRepository.save(customer);
        }

        Product product = productRepository.findById(orderDTO.getProductId())
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        // Create new order
        Order order = new Order();
        order.setCustomer(customer);
        order.setProduct(product);
        order.setQuantity(orderDTO.getQuantity());
        order.setTotalCost(orderDTO.getTotalCost());
        order.setSalesType(orderDTO.getSalesType());
        order.setSalesDate(orderDTO.getSalesDate() != null ? orderDTO.getSalesDate() : LocalDate.now());
        order.setOrderMethod("Online - Website");
        order.setShippingMethod("Standard Delivery");

        Order savedOrder = orderRepository.save(order);

        return savedOrder;
    }

    public List<TopProductDTO> getTopThreeMostPurchasedProducts(Integer customerId) {
        List<Order> orders = orderRepository.findAllByCustomer_cID(customerId);
        return orders.stream()
                .collect(Collectors.groupingBy(
                        order -> new ProductInfo(
                                order.getProduct().getPID(),
                                order.getProduct().getProductName(),
                                order.getProduct().getIndividualPrice()),
                        Collectors.summingLong(Order::getQuantity)))
                .entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(3)
                .map(entry -> new TopProductDTO(
                        entry.getKey().getPID(),
                        entry.getKey().getProductName(),
                        entry.getValue(),
                        entry.getKey().getIndividualPrice()))
                .collect(Collectors.toList());
    }

    // Helper class for grouping products
    private static class ProductInfo {
        private final Integer pID;
        private final String productName;
        private final double individualPrice;

        public ProductInfo(Integer pID, String productName, double individualPrice) {
            this.pID = pID;
            this.productName = productName;
            this.individualPrice = individualPrice;
        }

        public Integer getPID() {
            return pID;
        }

        public String getProductName() {
            return productName;
        }

        public double getIndividualPrice() {
            return individualPrice;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (o == null || getClass() != o.getClass())
                return false;
            ProductInfo that = (ProductInfo) o;
            return pID.equals(that.pID);
        }

        @Override
        public int hashCode() {
            return pID.hashCode();
        }
    }

    public ProductPurchaseHistoryDTO getCustomerPurchaseHistory(Integer customerId) {
        List<Order> orders = orderRepository.findAllByCustomer_cID(customerId);
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

    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }

    public Page<Order> getOrdersByFilters(
            Integer customerId,
            String salesType,
            List<Integer> productIds,
            LocalDate singleDate,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        return orderRepository.findByFilters(customerId, salesType, productIds, singleDate, startDate, endDate,
                pageable);
    }

    private LocalDate getAnalysisReferenceDate() {
        return LocalDate.now();
    }

    public CustomerSegmentDTO getActiveCustomers() {
        LocalDate referenceDate = getAnalysisReferenceDate();
        LocalDate thirtyDaysAgo = referenceDate.minusDays(30);

        List<Integer> customerIds = orderRepository.findActiveCustomers(
                thirtyDaysAgo,
                referenceDate);
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.ACTIVE, "Recency");
    }

    public CustomerSegmentDTO getReturningCustomers() {
        LocalDate referenceDate = getAnalysisReferenceDate();
        LocalDate oneYearAgo = referenceDate.minusYears(1);

        List<Integer> returningCustomers = orderRepository.findReturningCustomers(
                oneYearAgo,
                referenceDate);

        return new CustomerSegmentDTO(returningCustomers, CustomerSegmentType.RETURNING, "Recency");
    }

    public SalesMetrics getMetrics(Integer customerId, String salesType, List<Integer> productIds, LocalDate startDate,
            LocalDate endDate) {
        // Get all orders without pagination for metrics calculation
        Page<Order> filteredOrders = getOrdersByFilters(
                customerId,
                salesType,
                productIds,
                null, // singleDate
                startDate,
                endDate,
                Pageable.unpaged());
        List<Order> orders = filteredOrders.getContent();

        return new SalesMetrics(orders);
    }

    public CustomerSegmentDTO getDormantCustomers() {
        LocalDate referenceDate = getAnalysisReferenceDate();

        // Get all three customer lists using the reference date
        List<Integer> allCustomers = orderRepository.findAllCustomersWithPurchases(referenceDate);
        List<Integer> activeCustomers = getActiveCustomers().getCustomerIds();
        List<Integer> returningCustomers = getReturningCustomers().getCustomerIds();

        // Remove active and returning customers to get dormant ones
        allCustomers.removeAll(activeCustomers);
        allCustomers.removeAll(returningCustomers);

        return new CustomerSegmentDTO(allCustomers, CustomerSegmentType.DORMANT, "Recency");
    }

    public CustomerSegmentDTO getFrequentCustomers() {
        List<Integer> customerIds = orderRepository.findFrequentCustomers();
        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.FREQUENT, "Frequency");
    }

    public CustomerSegmentDTO getOccasionalCustomers() {
        // Get base occasional customers
        List<Integer> customerIds = orderRepository.findOccasionalCustomers();

        // Get frequent customers to exclude
        List<Integer> frequentCustomers = getFrequentCustomers().getCustomerIds();

        // Remove frequent customers from occasional list
        customerIds.removeAll(frequentCustomers);

        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.OCCASIONAL, "Frequency");
    }

    public CustomerSegmentDTO getOneTimeCustomers() {
        // Get base one-time customers
        List<Integer> customerIds = orderRepository.findOneTimeCustomers();

        // Get frequent and occasional customers to exclude
        List<Integer> frequentCustomers = getFrequentCustomers().getCustomerIds();
        List<Integer> occasionalCustomers = getOccasionalCustomers().getCustomerIds();

        // Remove frequent and occasional customers from one-time list
        customerIds.removeAll(frequentCustomers);
        customerIds.removeAll(occasionalCustomers);

        return new CustomerSegmentDTO(customerIds, CustomerSegmentType.ONE_TIME, "Frequency");
    }

    public List<CustomerSegmentDTO> getMonetarySegments() {
        List<Object[]> customerSpending = orderRepository.getCustomerTotalSpending();
        List<CustomerSegmentDTO> segments = new ArrayList<>();

        // Handle empty or null case
        if (customerSpending == null || customerSpending.isEmpty()) {
            // Return empty segments for all monetary types
            segments.add(new CustomerSegmentDTO(
                    new ArrayList<>(),
                    CustomerSegmentType.HIGH_VALUE,
                    "Monetary"));
            segments.add(new CustomerSegmentDTO(
                    new ArrayList<>(),
                    CustomerSegmentType.MID_TIER,
                    "Monetary"));
            segments.add(new CustomerSegmentDTO(
                    new ArrayList<>(),
                    CustomerSegmentType.LOW_SPEND,
                    "Monetary"));
            return segments;
        }

        // Sort customers by spending
        List<Integer> sortedCustomers = customerSpending.stream()
                .sorted((a, b) -> ((Double) b[1]).compareTo((Double) a[1]))
                .map(arr -> (Integer) arr[0])
                .collect(Collectors.toList());

        int totalCustomers = sortedCustomers.size();

        // Calculate segment sizes with minimum of 1
        int topTenPercent = Math.max(1, (int) Math.ceil(totalCustomers * 0.1));
        int bottomTwentyPercent = Math.max(1, (int) Math.ceil(totalCustomers * 0.2));

        // Adjust indices to prevent overlap for small customer counts
        if (totalCustomers <= 5) {
            // For very small numbers, split evenly
            topTenPercent = 1;
            bottomTwentyPercent = 1;
        }

        // Ensure midTier has at least one customer if possible
        int midTierStart = Math.min(topTenPercent, totalCustomers);
        int midTierEnd = Math.max(midTierStart,
                Math.min(totalCustomers - bottomTwentyPercent, totalCustomers - 1));

        // High-Value (top 10% or at least 1 customer)
        segments.add(new CustomerSegmentDTO(
                sortedCustomers.subList(0, midTierStart),
                CustomerSegmentType.HIGH_VALUE,
                "Monetary"));

        // Mid-Tier
        if (midTierStart < midTierEnd) {
            segments.add(new CustomerSegmentDTO(
                    sortedCustomers.subList(midTierStart, midTierEnd),
                    CustomerSegmentType.MID_TIER,
                    "Monetary"));
        } else {
            segments.add(new CustomerSegmentDTO(
                    new ArrayList<>(),
                    CustomerSegmentType.MID_TIER,
                    "Monetary"));
        }

        // Low-Spend (bottom 20% or at least 1 customer)
        segments.add(new CustomerSegmentDTO(
                sortedCustomers.subList(Math.max(midTierEnd, 0), totalCustomers),
                CustomerSegmentType.LOW_SPEND,
                "Monetary"));

        return segments;
    }
}
