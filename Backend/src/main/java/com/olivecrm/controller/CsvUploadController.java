package com.olivecrm.controller;

import com.olivecrm.service.CsvProcessingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
public class CsvUploadController {

    private static final Logger logger = LoggerFactory.getLogger(CsvUploadController.class);

    @Autowired
    private CsvProcessingService csvProcessingService;

    @PostMapping("/api/upload-csv")
    public ResponseEntity<String> uploadCsv(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a CSV file to upload.");
        }

        try {
            csvProcessingService.processCsvFile(file.getInputStream());
            return ResponseEntity.ok("CSV file processed successfully.");
        } catch (IOException e) {
            logger.error("Failed to read CSV file: " + e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to read CSV file: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Failed to process CSV file: " + e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Failed to process CSV file: " + e.getMessage());
        }
    }
}