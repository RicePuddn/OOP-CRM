package com.olivecrm.service;

import com.olivecrm.entity.Customer;
import com.olivecrm.entity.Order;
import com.olivecrm.entity.Product;
import com.olivecrm.util.CsvReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
public class CsvProcessingService {

    private static final Logger logger = LoggerFactory.getLogger(CsvProcessingService.class);

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private CsvReader csvReader;

    @Transactional
    public void processCsvFile(InputStream inputStream) throws Exception {
        logger.info("Starting to process CSV file");
        List<String[]> csvData = csvReader.readCsv(inputStream);
        logger.info("CSV file read successfully. Number of rows: {}", csvData.size());
        
        // Skip the header row
        for (int i = 1; i < csvData.size(); i++) {
            try {
                String[] row = csvData.get(i);
                logger.info("Processing row {}: {}", i, String.join(", ", row));
                processRow(row);
                logger.info("Row {} processed successfully", i);
            } catch (Exception e) {
                logger.error("Error processing row " + i + ": " + e.getMessage(), e);
                throw new Exception("Error processing CSV file at row " + i, e);
            }
        }
        logger.info("CSV file processing completed successfully");
    }

    private void processRow(String[] row) throws Exception {
        try {
            // Extract data from the row
            String saleDate = row[1];
            String saleType = row[2];
            String digital = row[3];
            int customerId = Integer.parseInt(row[4]);
            String zipCode = row[5];
            String shippingMethod = row[6];
            String productName = row[7];
            String productVariant = row[8];
            int quantity = Integer.parseInt(row[9]);
            double price = Double.parseDouble(row[10]);
            double productPrice = Double.parseDouble(row[11]);

            logger.info("Extracted data: saleDate={}, customerId={}, productName={}, quantity={}", saleDate, customerId, productName, quantity);

            // Update or create Customer
            Customer customer = entityManager.find(Customer.class, customerId);
            if (customer == null) {
                logger.info("Creating new customer with ID: {}", customerId);
                customer = new Customer();
                customer.setCID(customerId);
                customer.setZipcode(zipCode);
                entityManager.persist(customer);
            } else {
                logger.info("Updating existing customer with ID: {}", customerId);
                customer.setZipcode(zipCode);
                customer = entityManager.merge(customer);
            }
            logger.info("Customer processed successfully");

            // Update or create Product
            Product product = entityManager.createQuery("SELECT p FROM Product p WHERE p.productName = :name AND p.productVariant = :variant", Product.class)
                    .setParameter("name", productName)
                    .setParameter("variant", productVariant)
                    .getResultStream().findFirst().orElse(null);
            if (product == null) {
                logger.info("Creating new product: {} - {}", productName, productVariant);
                product = new Product();
                product.setProductName(productName);
                product.setProductVariant(productVariant);
                product.setIndividualPrice(productPrice);
                entityManager.persist(product);
            } else {
                logger.info("Updating existing product: {} - {}", productName, productVariant);
                product.setIndividualPrice(productPrice);
                product = entityManager.merge(product);
            }
            logger.info("Product processed successfully");

            // Create Order with relationships
            Order order = new Order();
            order.setCustomer(customer);
            order.setProduct(product);
            order.setQuantity(quantity);
            order.setTotalCost(price * quantity);
            order.setOrderMethod(digital);
            order.setSalesDate(parseSaleDate(saleDate));
            order.setSalesType(saleType);
            order.setShippingMethod(shippingMethod);
            entityManager.persist(order);
            logger.info("Order created successfully with customer ID: {} and product ID: {}", customer.getCID(), product.getPID());

        } catch (Exception e) {
            logger.error("Error processing row: " + e.getMessage(), e);
            throw new Exception("Error processing row: " + e.getMessage(), e);
        }
    }

    private LocalDateTime parseSaleDate(String saleDate) {
        DateTimeFormatter[] formatters = {
            DateTimeFormatter.ofPattern("dd/MM/yyyy"),
            DateTimeFormatter.ofPattern("MM/dd/yyyy"),
            DateTimeFormatter.ofPattern("yyyy-MM-dd")
        };

        for (DateTimeFormatter formatter : formatters) {
            try {
                LocalDate date = LocalDate.parse(saleDate, formatter);
                return date.atStartOfDay(); // Convert LocalDate to LocalDateTime at midnight
            } catch (DateTimeParseException e) {
                // Try the next formatter
            }
        }

        logger.error("Unable to parse date: {}", saleDate);
        throw new IllegalArgumentException("Unable to parse date: " + saleDate);
    }
}
