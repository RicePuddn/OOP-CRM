-- Clear existing test data
DELETE FROM orders WHERE customer_id IN (101, 102, 103, 104);
DELETE FROM customer WHERE cid IN (101, 102, 103, 104);

-- Create test customers
INSERT INTO customer (cid, first_name, last_name, zipcode) VALUES 
(101, 'Frequent', 'Shopper', '12345'),
(102, 'Occasional', 'Shopper', '23456'),
(103, 'OneTime', 'Buyer', '34567'),
(104, 'New', 'OneTime', '45678');

-- Frequent Shopper (Customer 101)
-- Current data: 12 orders in November 2024
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2024-11-02', 'Marketing', 'Standard Delivery', 10.0, 101, 2),
('Online - Website', 1, '2024-11-03', 'Marketing', 'Standard Delivery', 10.0, 101, 3),
('Online - Website', 1, '2024-11-04', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2024-11-05', 'Marketing', 'Standard Delivery', 10.0, 101, 2),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 3),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 2),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 3),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 2),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 10.0, 101, 3);

-- Historical data: 5 orders in November 2019
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-11-01', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2019-11-10', 'Marketing', 'Standard Delivery', 10.0, 101, 2),
('Online - Website', 1, '2019-11-15', 'Marketing', 'Standard Delivery', 10.0, 101, 3),
('Online - Website', 1, '2019-11-20', 'Marketing', 'Standard Delivery', 10.0, 101, 1),
('Online - Website', 1, '2019-11-25', 'Marketing', 'Standard Delivery', 10.0, 101, 2);

-- Occasional Shopper (Customer 102)
-- Current data: 4 orders in Q4 2024
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 20.0, 102, 1),
('Online - Website', 1, '2024-10-30', 'Marketing', 'Standard Delivery', 20.0, 102, 2),
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 20.0, 102, 3),
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 20.0, 102, 1);

-- Historical data: 2 orders in Q4 2019
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-11-22', 'Marketing', 'Standard Delivery', 20.0, 102, 1),
('Online - Website', 1, '2019-12-01', 'Marketing', 'Standard Delivery', 20.0, 102, 2);

-- Original One-time Buyer (Customer 103): single purchase in current month
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-06', 'Marketing', 'Standard Delivery', 30.0, 103, 1);

-- New One-time Buyer (Customer 104): single purchase in previous month
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 40.0, 104, 1);

-- Verification queries:

-- 1. Verify Frequent Shopper current pattern (should show 12 orders in November 2024)
SELECT customer_id, COUNT(*) as orders_in_month, DATE_FORMAT(sales_date, '%Y-%m') as month
FROM orders 
WHERE customer_id = 101
GROUP BY customer_id, DATE_FORMAT(sales_date, '%Y-%m')
HAVING month = '2024-11';

-- 2. Verify Frequent Shopper historical pattern (should show 5 orders in November 2019)
SELECT customer_id, COUNT(*) as orders_in_month, DATE_FORMAT(sales_date, '%Y-%m') as month
FROM orders 
WHERE customer_id = 101
GROUP BY customer_id, DATE_FORMAT(sales_date, '%Y-%m')
HAVING month = '2019-11';

-- 3. Verify Occasional Shopper current pattern (should show 4 orders in Q4 2024)
SELECT customer_id, COUNT(*) as orders_in_quarter, 
       YEAR(sales_date) as year, QUARTER(sales_date) as quarter
FROM orders 
WHERE customer_id = 102
GROUP BY customer_id, YEAR(sales_date), QUARTER(sales_date)
HAVING year = 2024 AND quarter = 4;

-- 4. Verify Occasional Shopper historical pattern (should show 2 orders in Q4 2019)
SELECT customer_id, COUNT(*) as orders_in_quarter, 
       YEAR(sales_date) as year, QUARTER(sales_date) as quarter
FROM orders 
WHERE customer_id = 102
GROUP BY customer_id, YEAR(sales_date), QUARTER(sales_date)
HAVING year = 2019 AND quarter = 4;

-- 5. Verify both One-time Buyers
SELECT customer_id, COUNT(*) as total_orders, 
       MIN(sales_date) as purchase_date
FROM orders 
WHERE customer_id IN (103, 104)
GROUP BY customer_id;

-- Summary query to show all orders chronologically
SELECT 
    c.cid as customer_id,
    c.first_name,
    c.last_name,
    o.sales_date,
    DATE_FORMAT(o.sales_date, '%Y-%m') as month,
    CONCAT(YEAR(o.sales_date), '-Q', QUARTER(o.sales_date)) as quarter
FROM customer c
JOIN orders o ON c.cid = o.customer_id
WHERE c.cid IN (101, 102, 103, 104)
ORDER BY o.sales_date;
