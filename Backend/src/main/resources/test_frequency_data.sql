-- Clear existing test data for these customers
DELETE FROM orders WHERE customer_id IN (8, 9, 15);

-- Frequent Shopper (customer_id 8): >10 purchases in multiple months across different years
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
-- January 2023 (11 purchases)
('Online - Website', 3, '2023-01-01', 'Direct - B2B', 'Standard Delivery', 17.70, 8, 1),
('Online - Website', 2, '2023-01-03', 'Marketing', 'Standard Delivery', 33.80, 8, 2),
('Online - Website', 1, '2023-01-05', 'Marketing', 'Standard Delivery', 5.90, 8, 3),
('Online - Website', 8, '2023-01-08', 'Marketing', 'Standard Delivery', 63.20, 8, 4),
('Online - Website', 1, '2023-01-11', 'Marketing', 'Standard Delivery', 5.90, 8, 1),
('Online - Website', 2, '2023-01-14', 'Marketing', 'Standard Delivery', 11.80, 8, 5),
('Online - Website', 12, '2023-01-17', 'Marketing', 'Standard Delivery', 70.80, 8, 6),
('Online - Website', 1, '2023-01-20', 'Marketing', 'Standard Delivery', 5.90, 8, 1),
('Online - Website', 6, '2023-01-23', 'Consignment', 'Standard Delivery', 35.40, 8, 1),
('Online - Website', 6, '2023-01-26', 'Consignment', 'Standard Delivery', 35.40, 8, 5),
('Online - Website', 6, '2023-01-29', 'Consignment', 'Standard Delivery', 47.40, 8, 4),
-- October 2024 (11 purchases)
('Online - Website', 3, '2024-10-01', 'Direct - B2B', 'Standard Delivery', 17.70, 8, 1),
('Online - Website', 2, '2024-10-03', 'Marketing', 'Standard Delivery', 33.80, 8, 2),
('Online - Website', 1, '2024-10-05', 'Marketing', 'Standard Delivery', 5.90, 8, 3),
('Online - Website', 8, '2024-10-08', 'Marketing', 'Standard Delivery', 63.20, 8, 4),
('Online - Website', 1, '2024-10-11', 'Marketing', 'Standard Delivery', 5.90, 8, 1),
('Online - Website', 2, '2024-10-14', 'Marketing', 'Standard Delivery', 11.80, 8, 5),
('Online - Website', 12, '2024-10-17', 'Marketing', 'Standard Delivery', 70.80, 8, 6),
('Online - Website', 1, '2024-10-20', 'Marketing', 'Standard Delivery', 5.90, 8, 1),
('Online - Website', 6, '2024-10-23', 'Consignment', 'Standard Delivery', 35.40, 8, 1),
('Online - Website', 6, '2024-10-26', 'Consignment', 'Standard Delivery', 35.40, 8, 5),
('Online - Website', 6, '2024-10-29', 'Consignment', 'Standard Delivery', 47.40, 8, 4);

-- Occasional Shopper (customer_id 9): 3-5 purchases in multiple quarters
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
-- Q1 2023 (4 purchases)
('Online - Website', 6, '2023-01-05', 'Direct - B2C', 'Standard Delivery', 119.40, 9, 8),
('Online - Website', 2, '2023-02-15', 'Direct - B2C', 'Standard Delivery', 23.80, 9, 9),
('Online - Website', 3, '2023-03-10', 'Direct - B2C', 'Standard Delivery', 59.70, 9, 8),
('Online - Website', 10, '2023-03-20', 'Direct - B2C', 'Standard Delivery', 199.00, 9, 8),
-- Q4 2024 (4 purchases)
('Online - Website', 6, '2024-10-05', 'Direct - B2C', 'Standard Delivery', 119.40, 9, 8),
('Online - Website', 2, '2024-11-15', 'Direct - B2C', 'Standard Delivery', 23.80, 9, 9),
('Online - Website', 3, '2024-12-10', 'Direct - B2C', 'Standard Delivery', 59.70, 9, 8),
('Online - Website', 10, '2024-12-20', 'Direct - B2C', 'Standard Delivery', 199.00, 9, 8);

-- One-time Buyer (customer_id 15): Single purchase in entire history
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-28', 'Direct - B2B', 'Standard Delivery', 17.70, 15, 1);

-- Verification queries:
-- Frequent Shoppers (>10 purchases in any month):
-- SELECT customer_id, YEAR(sales_date) as year, MONTH(sales_date) as month, COUNT(*) as order_count
-- FROM orders 
-- WHERE customer_id = 8
-- GROUP BY customer_id, YEAR(sales_date), MONTH(sales_date)
-- HAVING COUNT(*) > 10;
-- Expected: Two months with >10 purchases (Jan 2023 and Oct 2024)

-- Occasional Shoppers (3-5 purchases per quarter):
-- SELECT customer_id, 
--        YEAR(sales_date) as year, 
--        FLOOR((MONTH(sales_date)-1)/3) + 1 as quarter, 
--        COUNT(*) as order_count
-- FROM orders 
-- WHERE customer_id = 9
-- GROUP BY customer_id, YEAR(sales_date), FLOOR((MONTH(sales_date)-1)/3)
-- HAVING COUNT(*) BETWEEN 3 AND 5;
-- Expected: Two quarters with 4 purchases each (Q1 2023 and Q4 2024)

-- One-time Buyers:
-- SELECT customer_id, COUNT(*) as total_orders
-- FROM orders 
-- WHERE customer_id = 15
-- GROUP BY customer_id;
-- Expected: One purchase total
