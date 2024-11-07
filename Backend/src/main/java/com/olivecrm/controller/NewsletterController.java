package com.olivecrm.controller;

import com.olivecrm.dto.NewsletterDTO;
import com.olivecrm.service.NewsletterService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
        return newsletterService.mapEntityToDto(
            newsletterService.createNewsletter(dto));
    }

    @PutMapping("/update/{id}")
    public NewsletterDTO updateNewsletter(@PathVariable int id,
                                          @RequestBody NewsletterDTO dto) {
        return newsletterService.mapEntityToDto(
            newsletterService.updateNewsletter(id, dto));
    }

    @DeleteMapping("/delete/{id}")
    public void deleteNewsletter(@PathVariable int id) {
        newsletterService.deleteNewsletter(id);
    }
}
