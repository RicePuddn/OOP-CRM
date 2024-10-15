package com.olivecrm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String body) {
        if (to == null || to.isEmpty() || subject == null ||
            subject.isEmpty() || body == null || body.isEmpty()) {
            throw new IllegalArgumentException(
                "Email, subject, and body cannot be null or empty.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("shibashishibo@gmail.com");

        try {
            mailSender.send(message);
            System.out.println("Email sent successfully to " + to);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to);
            e.printStackTrace();
        }
    }
}