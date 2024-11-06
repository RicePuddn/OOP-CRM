-- Create additional test customers that shouldn't appear in any frequency segment
DELETE FROM orders WHERE customer_id IN (201, 202, 203, 204);
DELETE FROM customer WHERE cid IN (201, 202, 203, 204);

INSERT INTO customer (cid, first_name, last_name, zipcode) VALUES 
(201, 'Almost', 'Frequent', '45678'),    -- 9 orders in a month (not > 10)
(202, 'Almost', 'Occasional', '56789'),  -- 2 orders in quarter (not 3-5)
(203, 'Multiple', 'Orders', '67890'),    -- 2 orders total (not one-time)
(204, 'Six', 'Orders', '78901');         -- 6 orders in quarter (not 3-5)

-- Customer 201: Almost Frequent (9 orders in November 2024 - not enough for >10)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 15.0, 201, 1),
('Online - Website', 1, '2024-11-02', 'Marketing', 'Standard Delivery', 15.0, 201, 2),
('Online - Website', 1, '2024-11-03', 'Marketing', 'Standard Delivery', 15.0, 201, 3),
('Online - Website', 1, '2024-11-04', 'Marketing', 'Standard Delivery', 15.0, 201, 1),
('Online - Website', 1, '2024-11-04', 'Marketing', 'Standard Delivery', 15.0, 201, 2),
('Online - Website', 1, '2024-11-05', 'Marketing', 'Standard Delivery', 15.0, 201, 3),
('Online - Website', 1, '2024-11-05', 'Marketing', 'Standard Delivery', 15.0, 201, 1),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 15.0, 201, 2),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 15.0, 201, 3);

-- Customer 202: Almost Occasional (2 orders in Q4 2024 - not enough for 3-5)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 25.0, 202, 1),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 25.0, 202, 2);

-- Customer 203: Multiple Orders (2 orders total - more than one-time buyer)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 35.0, 203, 1),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 35.0, 203, 2);

-- Customer 204: Too Many Orders (6 orders in Q4 2024 - more than occasional 3-5)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-01', 'Marketing', 'Standard Delivery', 45.0, 204, 1),
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 45.0, 204, 2),
('Online - Website', 1, '2024-10-30', 'Marketing', 'Standard Delivery', 45.0, 204, 3),
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 45.0, 204, 1),
('Online - Website', 1, '2024-11-03', 'Marketing', 'Standard Delivery', 45.0, 204, 2),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 45.0, 204, 3);

-- Verification queries to show why these customers don't fit in any segment:

-- 1. Almost Frequent (should show 9 orders in November 2024 - not >10)
SELECT customer_id, COUNT(*) as orders_in_month, DATE_FORMAT(sales_date, '%Y-%m') as month
FROM orders 
WHERE customer_id = 201
GROUP BY customer_id, DATE_FORMAT(sales_date, '%Y-%m')
HAVING month = '2024-11';

-- 2. Almost Occasional (should show 2 orders in Q4 2024 - not between 3-5)
SELECT customer_id, COUNT(*) as orders_in_quarter,
       YEAR(sales_date) as year, QUARTER(sales_date) as quarter
FROM orders 
WHERE customer_id = 202
GROUP BY customer_id, YEAR(sales_date), QUARTER(sales_date)
HAVING year = 2024 AND quarter = 4;

-- 3. Multiple Orders (should show 2 orders total - not one-time)
SELECT customer_id, COUNT(*) as total_orders
FROM orders 
WHERE customer_id = 203
GROUP BY customer_id;

-- 4. Too Many Orders (should show 6 orders in Q4 2024 - more than 3-5)
SELECT customer_id, COUNT(*) as orders_in_quarter,
       YEAR(sales_date) as year, QUARTER(sales_date) as quarter
FROM orders 
WHERE customer_id = 204
GROUP BY customer_id, YEAR(sales_date), QUARTER(sales_date)
HAVING year = 2024 AND quarter = 4;

-- Summary query to show all orders
SELECT 
    c.cid as customer_id,
    c.first_name,
    c.last_name,
    COUNT(*) as total_orders,
    MIN(o.sales_date) as first_order,
    MAX(o.sales_date) as last_order,
    COUNT(DISTINCT DATE_FORMAT(o.sales_date, '%Y-%m')) as unique_months,
    GROUP_CONCAT(DISTINCT CONCAT(YEAR(o.sales_date), '-Q', QUARTER(o.sales_date))) as quarters
FROM customer c
JOIN orders o ON c.cid = o.customer_id
WHERE c.cid IN (201, 202, 203, 204)
GROUP BY c.cid, c.first_name, c.last_name
ORDER BY c.cid;
