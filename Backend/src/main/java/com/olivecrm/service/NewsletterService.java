package com.olivecrm.service;

import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Newsletter;
import com.olivecrm.repository.NewsletterRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NewsletterService {
    @Autowired private NewsletterRepository newsletterRepository;

    // List newsletters
    public List<Newsletter> getAllNewsletters() {
        return newsletterRepository.findAll();
    }

    // Get newsletters by id
    public Newsletter getNewsletterById(int id) {
        Optional<Newsletter> existingNewsletter =
            newsletterRepository.findById(id);
        return existingNewsletter.orElse(null);
    }
    // Get newsletters by target
    public List<Newsletter> getNewsletterByTarget(String target) {
        return newsletterRepository.findByTarget(target);
    }
    // Create newsletter
    public Newsletter createNewsletter(String title, String content,
                                       Employee createdBy) {
        Newsletter newsletter = new Newsletter();
        newsletter.setTitle(title);
        newsletter.setContent(content);
        newsletter.setCreatedBy(createdBy);
        return newsletterRepository.save(newsletter);
    }

    // Update newsletter
    public Newsletter updateNewsletter(int id, String newTitle,
                                       String newContent) {
        Optional<Newsletter> existingNewsletter =
            newsletterRepository.findById(id);
        System.out.println("finding existing newsletter");
        if (existingNewsletter.isPresent()) {
            Newsletter newsletter = existingNewsletter.get();
            newsletter.setTitle(newTitle);
            newsletter.setContent(newContent);
            return newsletterRepository.save(
                newsletter); // Save updated newsletter
        } else {
            System.out.println("Newsletter not found");
        }
        return null;
    }

    // Delete a newsletter
    public void deleteNewsletter(int id) {
        newsletterRepository.deleteById(id);
    }
}
