package com.olivecrm.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Newsletter;
import com.olivecrm.repository.NewsletterRepository;

@Service
public class NewsletterService {
    @Autowired private NewsletterRepository newsletterRepository;

    // List newsletters
    public List<Newsletter> getAllNewsletters() {
        return newsletterRepository.findAll();
    }

    //Create newsletter
    public Newsletter CreaNewsletter(String title, String content,
                                     Employee createdBy) {
        Newsletter newsletter = new Newsletter();
        newsletter.setTitle(title);
        newsletter.setContent(content);
        newsletter.setCreatedBy(createdBy);
        return newsletterRepository.save(newsletter);
    }

// Update newsletter
public Newsletter updateNewsletter(Integer newsID, String title, String content) {
    Newsletter newsletter = newsletterRepository.findById(newsID).get();
          newsletter.setTitle(title);
}
