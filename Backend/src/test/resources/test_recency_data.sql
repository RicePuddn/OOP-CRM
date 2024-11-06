-- Test data for recency segmentation
-- Current reference date: 2024-11-06

-- Clean up existing test data
DELETE FROM orders WHERE customer_id IN (101, 102, 103, 104, 105, 106, 107, 108, 109, 110);
DELETE FROM customer WHERE cid IN (101, 102, 103, 104, 105, 106, 107, 108, 109, 110);

-- Insert test customers
INSERT INTO customer (cid, first_name, last_name, zipcode) VALUES
(101, 'Active', 'Regular', '12345'),      -- Regular active customer
(102, 'Active', 'Edge', '12345'),         -- Edge case active (exactly 30 days)
(103, 'Active', 'Multiple', '12345'),     -- Multiple recent purchases
(104, 'Dormant', 'Old', '12345'),         -- Old dormant customer
(105, 'Dormant', 'Edge', '12345'),        -- Edge case dormant (exactly 6 months)
(106, 'Dormant', 'Historical', '12345'),  -- Historical dormant
(107, 'Returning', 'Basic', '12345'),     -- Basic returning customer
(108, 'Returning', 'Edge', '12345'),      -- Edge case returning
(109, 'Returning', 'Complex', '12345'),   -- Complex returning case
(110, 'Mixed', 'Pattern', '12345');       -- Mixed purchase pattern

-- Test Case 1: Active Customers (within last 30 days)
-- Customer 101: Regular active customer with recent purchase
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 10, 101, 1);

-- Customer 102: Edge case active (exactly 30 days ago)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-10-07', 'Marketing', 'Standard Delivery', 10, 102, 1);

-- Customer 103: Multiple recent purchases
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-05', 'Marketing', 'Standard Delivery', 10, 103, 1),
('Online - Website', 1, '2024-10-20', 'Marketing', 'Standard Delivery', 10, 103, 2),
('Online - Website', 1, '2024-10-15', 'Marketing', 'Standard Delivery', 10, 103, 3);

-- Test Case 2: Dormant Customers (no purchase in 6 months)
-- Customer 104: Old dormant customer
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-01-15', 'Marketing', 'Standard Delivery', 10, 104, 1),
('Online - Website', 1, '2023-12-20', 'Marketing', 'Standard Delivery', 10, 104, 2);

-- Customer 105: Edge case dormant (exactly 6 months ago)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-05-06', 'Marketing', 'Standard Delivery', 10, 105, 1);

-- Customer 106: Historical dormant
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2023-06-15', 'Marketing', 'Standard Delivery', 10, 106, 1),
('Online - Website', 1, '2023-05-20', 'Marketing', 'Standard Delivery', 10, 106, 2);

-- Test Case 3: Returning Customers (recent purchase after 1+ year gap)
-- Customer 107: Basic returning customer
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 10, 107, 1),  -- Recent purchase
('Online - Website', 1, '2023-05-15', 'Marketing', 'Standard Delivery', 10, 107, 2);  -- Old purchase

-- Customer 108: Edge case returning (exactly 1 year gap)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-05', 'Marketing', 'Standard Delivery', 10, 108, 1),  -- Recent purchase
('Online - Website', 1, '2023-11-06', 'Marketing', 'Standard Delivery', 10, 108, 2);  -- One year ago

-- Customer 109: Complex returning case with multiple old purchases
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-01', 'Marketing', 'Standard Delivery', 10, 109, 1),  -- Recent purchase
('Online - Website', 1, '2023-01-15', 'Marketing', 'Standard Delivery', 10, 109, 2),  -- Old purchase
('Online - Website', 1, '2022-12-20', 'Marketing', 'Standard Delivery', 10, 109, 3);  -- Older purchase

-- Test Case 4: Mixed Pattern
-- Customer 110: Mixed purchase pattern (should be active due to most recent purchase)
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-11-03', 'Marketing', 'Standard Delivery', 10, 110, 1),  -- Recent (active)
('Online - Website', 1, '2024-05-15', 'Marketing', 'Standard Delivery', 10, 110, 2),  -- 6 months ago
('Online - Website', 1, '2023-11-20', 'Marketing', 'Standard Delivery', 10, 110, 3);  -- 1 year ago
