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

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

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
        return orderRepository.findByFilters(customerId, salesType, totalCost, startDate, endDate, pageable);
    }
}
