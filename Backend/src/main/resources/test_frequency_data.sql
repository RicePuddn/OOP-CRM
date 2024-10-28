-- Clear existing test data for these customers
DELETE FROM orders WHERE customer_id IN (8, 9, 15);

-- Frequent Shopper (customer_id 8): >10 purchases in October 2024
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 3, '2024-10-01', 'Direct - B2B', 'Standard Delivery', 17.700000000000003, 8, 1),
('Online - Website', 2, '2024-10-05', 'Marketing', 'Standard Delivery', 33.8, 8, 2),
('Online - Website', 1, '2024-10-08', 'Marketing', 'Standard Delivery', 5.9, 8, 3),
('Online - Website', 8, '2024-10-12', 'Marketing', 'Standard Delivery', 63.2, 8, 4),
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 5.9, 8, 1),
('Online - Website', 2, '2024-10-18', 'Marketing', 'Standard Delivery', 11.8, 8, 5),
('Online - Website', 12, '2024-10-20', 'Marketing', 'Standard Delivery', 70.800000000000001, 8, 6),
('Online - Website', 1, '2024-10-22', 'Marketing', 'Standard Delivery', 5.9, 8, 1),
('Online - Website', 6, '2024-10-24', 'Consignment', 'Standard Delivery', 35.400000000000006, 8, 1),
('Online - Website', 6, '2024-10-26', 'Consignment', 'Standard Delivery', 35.400000000000006, 8, 5),
('Online - Website', 6, '2024-10-28', 'Consignment', 'Standard Delivery', 47.400000000000006, 8, 4);

-- Occasional Shopper (customer_id 9): 4 purchases in Q4 2024
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 6, '2024-10-05', 'Direct - B2C', 'Standard Delivery', 119.399999999999999, 9, 8),
('Online - Website', 2, '2024-10-15', 'Direct - B2C', 'Standard Delivery', 23.8, 9, 9),
('Online - Website', 3, '2024-10-25', 'Direct - B2C', 'Standard Delivery', 59.699999999999996, 9, 8),
('Online - Website', 10, '2024-10-28', 'Direct - B2C', 'Standard Delivery', 199.0, 9, 8);

-- One-time Buyer (customer_id 15): Single purchase
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-28', 'Direct - B2B', 'Standard Delivery', 17.700000000000003, 15, 1);

-- Verification queries (uncomment to run):
-- SELECT customer_id, COUNT(*) as order_count FROM orders WHERE customer_id = 8 AND sales_date >= '2024-10-01' AND sales_date <= '2024-10-31' GROUP BY customer_id;
-- Expected: customer_id: 8, order_count: 11 (Frequent)

-- SELECT customer_id, COUNT(*) as order_count FROM orders WHERE customer_id = 9 AND sales_date >= '2024-10-01' AND sales_date <= '2024-12-31' GROUP BY customer_id;
-- Expected: customer_id: 9, order_count: 4 (Occasional)

-- SELECT customer_id, COUNT(*) as order_count FROM orders WHERE customer_id = 15 GROUP BY customer_id;
-- Expected: customer_id: 15, order_count: 1 (One-time)
