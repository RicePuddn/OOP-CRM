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
@RequestMapping("/newsletter")
public class NewsletterController {

    @Autowired private NewsletterService newsletterService;

    @Autowired private EmployeeRepository employeeRepository;

    // Create a new newsletter
    @PostMapping("/create")
    public ResponseEntity<Newsletter>
    createNewsletter(@RequestParam String title, @RequestParam String content,
                     @RequestParam String username) {
        // Find the employee by username
        Employee employee =
            employeeRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("Employee not found"));

        // Call the service to create the newsletter
        Newsletter createdNewsletter =
            newsletterService.createNewsletter(title, content, employee);

        // Return the created newsletter
        return ResponseEntity.ok(createdNewsletter);
    }

    // Get all newsletters
    @GetMapping("/all")
    public ResponseEntity<List<Newsletter>> getAllNewsletters() {
        List<Newsletter> newsletters = newsletterService.getAllNewsletters();
        return ResponseEntity.ok(newsletters);
    }

    // Get a newsletter by ID
    @GetMapping("/{id}")
    public ResponseEntity<Newsletter> getNewsletterById(@PathVariable int id) {
        Newsletter newsletter = newsletterService.getNewsletterById(id);

        if (newsletter != null) {
            return ResponseEntity.ok(newsletter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Update a newsletter
    @PutMapping("/update")
    public ResponseEntity<Newsletter>
    updateNewsletter(@RequestParam int id, @RequestParam String title,
                     @RequestParam String content) {
        Newsletter updatedNewsletter =
            newsletterService.updateNewsletter(id, title, content);

        if (updatedNewsletter != null) {
            return ResponseEntity.ok(updatedNewsletter);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a newsletter by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNewsletter(@PathVariable int id) {
        newsletterService.deleteNewsletter(id);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }
}
