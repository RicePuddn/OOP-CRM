-- Clear existing test data
DELETE FROM orders WHERE customer_id IN (301, 302);
DELETE FROM customer WHERE cid IN (301, 302);

-- Create test customers
INSERT INTO customer (cid, first_name, last_name, zipcode) VALUES 
(301, 'Historical', 'Frequent', '89012'),    -- Was frequent in 2019
(302, 'Historical', 'Occasional', '90123');  -- Was occasional in 2019

-- Historical Frequent Shopper (Customer 301)
-- Had 11 orders in November 2019 (would have qualified as frequent then)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-11-01', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-11-03', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-11-05', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-11-07', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-11-09', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-11-11', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-11-13', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-11-15', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-11-17', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-11-19', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-11-21', 'Marketing', 'Standard Delivery', 10.0, 301, 2);

-- Also had 12 orders in December 2019
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-12-01', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-12-03', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-12-05', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-12-07', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-12-09', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-12-11', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-12-13', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-12-15', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-12-17', 'Marketing', 'Standard Delivery', 10.0, 301, 3),
('Online - Website', 1, '2019-12-19', 'Marketing', 'Standard Delivery', 10.0, 301, 1),
('Online - Website', 1, '2019-12-21', 'Marketing', 'Standard Delivery', 10.0, 301, 2),
('Online - Website', 1, '2019-12-23', 'Marketing', 'Standard Delivery', 10.0, 301, 3);

-- Historical Occasional Shopper (Customer 302)
-- Had 4 orders in Q4 2019 (would have qualified as occasional then)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-10-15', 'Marketing', 'Standard Delivery', 20.0, 302, 1),
('Online - Website', 1, '2019-11-01', 'Marketing', 'Standard Delivery', 20.0, 302, 2),
('Online - Website', 1, '2019-11-15', 'Marketing', 'Standard Delivery', 20.0, 302, 3),
('Online - Website', 1, '2019-12-01', 'Marketing', 'Standard Delivery', 20.0, 302, 1);

-- Also had 3 orders in Q3 2019
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2019-07-15', 'Marketing', 'Standard Delivery', 20.0, 302, 1),
('Online - Website', 1, '2019-08-15', 'Marketing', 'Standard Delivery', 20.0, 302, 2),
('Online - Website', 1, '2019-09-15', 'Marketing', 'Standard Delivery', 20.0, 302, 3);

-- Verification queries:

-- 1. Verify Historical Frequent Shopper pattern in 2019
SELECT customer_id, COUNT(*) as orders_in_month, DATE_FORMAT(sales_date, '%Y-%m') as month
FROM orders 
WHERE customer_id = 301
GROUP BY customer_id, DATE_FORMAT(sales_date, '%Y-%m')
ORDER BY month;

-- 2. Verify Historical Occasional Shopper pattern in 2019
SELECT customer_id, COUNT(*) as orders_in_quarter,
       YEAR(sales_date) as year, QUARTER(sales_date) as quarter
FROM orders 
WHERE customer_id = 302
GROUP BY customer_id, YEAR(sales_date), QUARTER(sales_date)
ORDER BY year, quarter;

-- Summary query to show all historical orders
SELECT 
    c.cid as customer_id,
    c.first_name,
    c.last_name,
    COUNT(*) as total_orders,
    MIN(o.sales_date) as first_order,
    MAX(o.sales_date) as last_order,
    GROUP_CONCAT(DISTINCT DATE_FORMAT(o.sales_date, '%Y-%m')) as months_with_orders,
    GROUP_CONCAT(DISTINCT CONCAT(YEAR(o.sales_date), '-Q', QUARTER(o.sales_date))) as quarters_with_orders
FROM customer c
JOIN orders o ON c.cid = o.customer_id
WHERE c.cid IN (301, 302)
GROUP BY c.cid, c.first_name, c.last_name
ORDER BY c.cid;

-- Monthly order counts for Customer 301 (Historical Frequent)
SELECT 
    DATE_FORMAT(sales_date, '%Y-%m') as month,
    COUNT(*) as order_count
FROM orders
WHERE customer_id = 301
GROUP BY DATE_FORMAT(sales_date, '%Y-%m')
ORDER BY month;

-- Quarterly order counts for Customer 302 (Historical Occasional)
SELECT 
    YEAR(sales_date) as year,
    QUARTER(sales_date) as quarter,
    COUNT(*) as order_count
FROM orders
WHERE customer_id = 302
GROUP BY YEAR(sales_date), QUARTER(sales_date)
ORDER BY year, quarter;
