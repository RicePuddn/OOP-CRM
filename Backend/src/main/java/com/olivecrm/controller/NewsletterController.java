package com.olivecrm.controller;

import com.olivecrm.dto.NewsletterDTO;
import com.olivecrm.entity.Newsletter;
import com.olivecrm.service.NewsletterService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/newsletter")
public class NewsletterController {

    @Autowired private NewsletterService newsletterService;

    @GetMapping("/all")
    public List<NewsletterDTO> getAllNewsletters() {
        return newsletterService.getAllNewsletters();
    }

    @GetMapping("/{id}")
    public NewsletterDTO getNewsletterById(@PathVariable int id) {
        return newsletterService.getNewsletterById(id);
    }

    @PostMapping("/create")
    public NewsletterDTO createNewsletter(@RequestBody NewsletterDTO dto) {
        Newsletter createdNewsletter = newsletterService.createNewsletter(dto);
        return newsletterService.mapEntityToDto(createdNewsletter);
    }

    @PutMapping("/update/{id}")
    public NewsletterDTO updateNewsletter(@PathVariable int id,
                                          @RequestBody NewsletterDTO dto) {
        return newsletterService.mapEntityToDto(
            newsletterService.updateNewsletter(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteNewsletter(@PathVariable int id) {
        System.err.println("Deleting newsletter with id in controller: " + id);
        newsletterService.deleteNewsletter(id);
    }
}
