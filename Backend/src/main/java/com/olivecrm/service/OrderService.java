package com.olivecrm.service;

import com.olivecrm.entity.Order;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.List;

@Service
public class OrderService {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional(readOnly = true)
    public Page<Order> getAllOrders(Pageable pageable) {
        TypedQuery<Order> query = entityManager.createQuery(
            "SELECT o FROM Order o JOIN FETCH o.customer JOIN FETCH o.product", Order.class)
            .setFirstResult((int) pageable.getOffset())
            .setMaxResults(pageable.getPageSize());

        List<Order> orders = query.getResultList();

        TypedQuery<Long> countQuery = entityManager.createQuery(
            "SELECT COUNT(o) FROM Order o", Long.class);
        Long total = countQuery.getSingleResult();

        return new org.springframework.data.domain.PageImpl<>(orders, pageable, total);
    }
}
