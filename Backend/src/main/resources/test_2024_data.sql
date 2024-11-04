-- Insert orders for 2024 to test frequency analysis

-- Frequent customer (customer_id 5) with >10 orders in January 2024
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 3, '2024-01-01', 'Marketing', 'Standard Delivery', 17.7, 5, 1),
('Online - Website', 2, '2024-01-03', 'Marketing', 'Standard Delivery', 33.8, 5, 2),
('Online - Website', 1, '2024-01-05', 'Marketing', 'Standard Delivery', 5.9, 5, 3),
('Online - Website', 8, '2024-01-07', 'Marketing', 'Standard Delivery', 63.2, 5, 4),
('Online - Website', 1, '2024-01-09', 'Marketing', 'Standard Delivery', 5.9, 5, 1),
('Online - Website', 2, '2024-01-11', 'Marketing', 'Standard Delivery', 11.8, 5, 5),
('Online - Website', 12, '2024-01-13', 'Marketing', 'Standard Delivery', 70.8, 5, 6),
('Online - Website', 1, '2024-01-15', 'Marketing', 'Standard Delivery', 5.9, 5, 1),
('Online - Website', 2, '2024-01-17', 'Marketing', 'Standard Delivery', 11.8, 5, 5),
('Online - Website', 3, '2024-01-19', 'Marketing', 'Standard Delivery', 17.7, 5, 1),
('Online - Website', 4, '2024-01-21', 'Marketing', 'Standard Delivery', 33.8, 5, 2),
('Online - Website', 2, '2024-01-23', 'Marketing', 'Standard Delivery', 11.8, 5, 5);

-- Occasional customer (customer_id 6) with exactly 4 orders in Q4 2023
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 6, '2023-10-15', 'Consignment', 'Standard Delivery', 35.4, 6, 1),
('Online - Website', 6, '2023-11-01', 'Consignment', 'Standard Delivery', 35.4, 6, 5),
('Online - Website', 6, '2023-11-20', 'Consignment', 'Standard Delivery', 35.4, 6, 6),
('Online - Website', 6, '2023-12-15', 'Consignment', 'Standard Delivery', 47.4, 6, 4);

-- Another occasional customer (customer_id 7) with 3 orders in Q4 2023
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 4, '2023-10-20', 'Marketing', 'Standard Delivery', 25.4, 7, 1),
('Online - Website', 3, '2023-11-15', 'Marketing', 'Standard Delivery', 22.4, 7, 5),
('Online - Website', 5, '2023-12-20', 'Marketing', 'Standard Delivery', 32.4, 7, 6);

-- One-time customers (customer_id 8, 9) with exactly one order each
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 1, '2024-01-30', 'Marketing', 'Standard Delivery', 19.9, 8, 8),
('Online - Website', 2, '2024-01-15', 'Direct - B2B', 'Standard Delivery', 29.9, 9, 7);

-- Additional orders outside the analysis window (2023 Q3) to ensure they don't affect the counts
INSERT INTO orders (order_method, quantity, sales_date, sales_type, shipping_method, total_cost, customer_id, product_id) VALUES
('Online - Website', 3, '2023-08-15', 'Marketing', 'Standard Delivery', 35.4, 10, 1),
('Online - Website', 2, '2023-09-01', 'Marketing', 'Standard Delivery', 25.4, 10, 5);
