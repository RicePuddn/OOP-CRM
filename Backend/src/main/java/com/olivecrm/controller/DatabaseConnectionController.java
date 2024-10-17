package com.olivecrm.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DatabaseConnectionController {

    private static final Logger logger =
        LoggerFactory.getLogger(DatabaseConnectionController.class);

    @Autowired private JdbcTemplate jdbcTemplate;

    @GetMapping("/")
    public String home() {
        logger.info("Home endpoint accessed");
        return "Welcome to the Database Connection Checker";
    }

    @GetMapping("/db-connection-status")
    public String checkDatabaseConnection() {
        logger.info("Database connection check initiated");
        try {
            Integer result =
                jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            if (result != null && result == 1) {
                logger.info("Database connection successful");
                return "Database Connection Status: Successful";
            } else {
                logger.error("Database connection failed: Unexpected result");
                return "Database Connection Failed: Unexpected result";
            }
        } catch (Exception e) {
            logger.error("Database connection failed", e);
            e.printStackTrace();
            return "Database Connection Failed: " + e.getMessage();
        }
    }
}