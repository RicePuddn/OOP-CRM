package com.olivecrm.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class DatabaseConnectionController {

    private static final Logger logger = LoggerFactory.getLogger(DatabaseConnectionController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String home() {
        logger.info("Home endpoint accessed");
        return "Welcome to the Database Connection Checker";
    }

    @GetMapping("/db-connection-status")
    public String checkDatabaseConnection() {
        logger.info("Database connection check initiated");
        try {
            String result = jdbcTemplate.queryForObject("SELECT id from orders", String.class);
            logger.info("Database connection successful");
            return "Database Connection Status: " + result;
        } catch (Exception e) {
            logger.error("Database connection failed", e);
            return "Database Connection Failed: " + e.getMessage();
        }
    }
}