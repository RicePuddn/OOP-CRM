package com.olivecrm.controller;

import com.olivecrm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EmailController {

    @Autowired private EmailService emailService;

    @GetMapping("/send-email")
    public ResponseEntity<String> sendEmail(@RequestParam String to,
                                            @RequestParam String subject,
                                            @RequestParam String message) {
        try {
            emailService.sendEmail(to, subject, message);
            return ResponseEntity.ok("Email sent successfully to " + to);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid input: " +
                                                    e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to send email: " + e.getMessage());
        }
    }
}