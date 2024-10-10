drop schema if exists olivecrmdb;
CREATE DATABASE olivecrmdb ;
USE olivecrmdb;
CREATE TABLE ORDERS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantity INT NOT NULL,
    total_cost DOUBLE NOT NULL,
    order_method VARCHAR(255),
    sales_date DATETIME NOT NULL,
    sales_type VARCHAR(255),
    shipping_method VARCHAR(255) NOT NULL
);
CREATE TABLE EMPLOYEES (
    username VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('MARKETING', 'SALES', 'ADMIN') NOT NULL
);
CREATE TABLE PRODUCT (
    pID INT AUTO_INCREMENT PRIMARY KEY,
    productName VARCHAR(100) NOT NULL,
    productVariant VARCHAR(50),
    individualPrice DECIMAL(10, 2)
);
CREATE TABLE CUSTOMER (
    cID INT PRIMARY KEY,
    zipcode VARCHAR(10)
);