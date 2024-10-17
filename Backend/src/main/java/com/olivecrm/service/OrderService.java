package com.olivecrm.service;

import com.olivecrm.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

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

        return new PageImpl<>(orders, pageable, total);
    }

    @Transactional(readOnly = true)
    public Page<Order> getFilteredOrders(Long customerId, String salesType, Double minTotalCost, Double maxTotalCost, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        logger.info("Starting getFilteredOrders with parameters: customerId={}, salesType={}, minTotalCost={}, maxTotalCost={}, startDate={}, endDate={}, pageable={}",
                customerId, salesType, minTotalCost, maxTotalCost, startDate, endDate, pageable);

        try {
            CriteriaBuilder cb = entityManager.getCriteriaBuilder();
            CriteriaQuery<Order> query = cb.createQuery(Order.class);
            Root<Order> order = query.from(Order.class);
            
            logger.debug("Setting up joins");
            order.fetch("customer", JoinType.LEFT);
            order.fetch("product", JoinType.LEFT);

            List<Predicate> predicates = new ArrayList<>();

            logger.debug("Building predicates");
            if (customerId != null) {
                predicates.add(cb.equal(order.get("customer").get("cID"), customerId));
                logger.debug("Added customerId predicate: {}", customerId);
            }
            if (salesType != null && !salesType.trim().isEmpty()) {
                predicates.add(cb.equal(order.get("salesType"), salesType.trim()));
                logger.debug("Added salesType predicate: {}", salesType);
            }
            if (minTotalCost != null) {
                predicates.add(cb.greaterThanOrEqualTo(order.get("totalCost"), minTotalCost));
                logger.debug("Added minTotalCost predicate: {}", minTotalCost);
            }
            if (maxTotalCost != null) {
                predicates.add(cb.lessThanOrEqualTo(order.get("totalCost"), maxTotalCost));
                logger.debug("Added maxTotalCost predicate: {}", maxTotalCost);
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(order.get("salesDate"), startDate));
                logger.debug("Added startDate predicate: {}", startDate);
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(order.get("salesDate"), endDate));
                logger.debug("Added endDate predicate: {}", endDate);
            }

            logger.debug("Predicates built: {}", predicates);

            if (!predicates.isEmpty()) {
                query.where(cb.and(predicates.toArray(new Predicate[0])));
            }
            query.orderBy(cb.desc(order.get("salesDate")));

            logger.debug("Executing query");
            TypedQuery<Order> typedQuery = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize());

            List<Order> orders = typedQuery.getResultList();
            logger.debug("Query executed, result size: {}", orders.size());

            // Count query
            CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
            Root<Order> countRoot = countQuery.from(Order.class);
            countQuery.select(cb.count(countRoot));
            if (!predicates.isEmpty()) {
                countQuery.where(cb.and(predicates.toArray(new Predicate[0])));
            }
            Long total = entityManager.createQuery(countQuery).getSingleResult();

            logger.info("Filtered orders count: {}", total);

            return new PageImpl<>(orders, pageable, total);
        } catch (Exception e) {
            logger.error("Error in getFilteredOrders", e);
            throw e;
        }
    }
}
