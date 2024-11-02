package com.olivecrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Newsletter;
import com.olivecrm.repository.EmployeeRepository;
import com.olivecrm.service.NewsletterService;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @Autowired private NewsletterService newsletterService;

    @Autowired private EmployeeRepository employeeRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createNewsletter(
        @RequestParam String title, @RequestParam String content,
        @RequestParam String username) { 
        try {
            
            Employee employee =
                employeeRepository.findByUsername(username).orElseThrow(
                    ()
                        -> new RuntimeException(
                            "Employee not found with username: " + username));

            
            Newsletter createdNewsletter =
                newsletterService.createNewsletter(title, content, employee);

            
            return ResponseEntity.ok(createdNewsletter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                "Error creating newsletter: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Newsletter>> getAllNewsletters() {
        List<Newsletter> newsletters = newsletterService.getAllNewsletters();
        return ResponseEntity.ok(newsletters);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Newsletter> getNewsletterById(@PathVariable int id) {
        Newsletter newsletter = newsletterService.getNewsletterById(id);

        if (newsletter != null) {
            return ResponseEntity.ok(newsletter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateNewsletter(@RequestParam int id,
                                              @RequestParam String title,
                                              @RequestParam String content) {
        try {
            Newsletter updatedNewsletter =
                newsletterService.updateNewsletter(id, title, content);

            if (updatedNewsletter != null) {
                return ResponseEntity.ok(updatedNewsletter);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                "Error updating newsletter: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteNewsletter(@PathVariable int id) {
        try {
            newsletterService.deleteNewsletter(id);
            return ResponseEntity.noContent().build(); // Return 204 No Content
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                "Error deleting newsletter: " + e.getMessage());
        }
    }
}
