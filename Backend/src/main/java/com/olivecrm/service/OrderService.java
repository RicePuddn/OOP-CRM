package com.olivecrm.service;

import com.olivecrm.entity.Order;
import com.olivecrm.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

// For the backend
@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable); // Utilize the JpaRepository method for pagination
    }

    public List<Order> getOrdersByCustomerId(int customerId) {
        return orderRepository.findByCustomer_cID(customerId); // Ensure this matches the getter method name in Customer
    }

    public List<Order> getOrdersBySalesType(String salesType) {
        return orderRepository.findBySalesType(salesType);
    }

    public List<Order> getOrdersBySalesDate(LocalDate salesDate) {
        return orderRepository.findBySalesDate(salesDate);
    }

    public List<Order> getOrdersByTotalCost(Double totalCost) {
        return orderRepository.findByTotalCost(totalCost);
    }

    public List<Order> getOrdersByFilters(Integer customerId, String salesType, LocalDate salesDate, Double totalCost, Pageable pageable) {
        return orderRepository.findByFilters(customerId, salesType, salesDate, totalCost, pageable);
    }
}
