package com.olivecrm.service;

import com.olivecrm.dto.NewsletterDTO;
import com.olivecrm.entity.Employee;
import com.olivecrm.entity.Newsletter;
import com.olivecrm.repository.EmployeeRepository;
import com.olivecrm.repository.NewsletterRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NewsletterService {
    @Autowired private NewsletterRepository newsletterRepository;
    @Autowired private EmployeeRepository employeeRepository;

    public List<NewsletterDTO> getAllNewsletters() {
        System.out.println("Service Layer");
        return newsletterRepository.findAll()
            .stream()
            .map(this::mapEntityToDto)
            .collect(Collectors.toList());
    }

    public NewsletterDTO getNewsletterById(int id) {
        return newsletterRepository.findById(id)
            .map(this::mapEntityToDto)
            .orElse(null);
    }

    public Newsletter createNewsletter(NewsletterDTO dto) {
        Newsletter newsletter = mapDtoToEntity(dto);
        return newsletterRepository.save(newsletter);
    }

    public Newsletter updateNewsletter(int id, NewsletterDTO dto) {
        Optional<Newsletter> existingNewsletterOpt =
            newsletterRepository.findById(id);
        if (existingNewsletterOpt.isPresent()) {
            Newsletter existingNewsletter = existingNewsletterOpt.get();
            existingNewsletter.setTitle(dto.getTitle());
            existingNewsletter.setContent(dto.getContent());
            existingNewsletter.setTarget(dto.getTarget());

            if (dto.getUsername() != null) {
                Employee creator =
                    employeeRepository.findByUsername(dto.getUsername())
                        .orElseThrow(
                            () -> new RuntimeException("User not found"));
                existingNewsletter.setCreatedBy(creator);
            }

            return newsletterRepository.save(existingNewsletter);
        }
        throw new RuntimeException("Newsletter not found with ID: " + id);
    }

    public void deleteNewsletter(int id) {
        newsletterRepository.deleteById(id);
    }

    public NewsletterDTO mapEntityToDto(Newsletter newsletter) {
        NewsletterDTO dto = new NewsletterDTO();
        dto.setId(newsletter.getNewsID());
        dto.setTitle(newsletter.getTitle());
        dto.setContent(newsletter.getContent());
        dto.setTarget(newsletter.getTarget());
        dto.setUsername(
            newsletter.getCreatedBy().getUsername()); // Map username
        return dto;
    }

    public Newsletter mapDtoToEntity(NewsletterDTO dto) {
        Newsletter newsletter = new Newsletter();
        newsletter.setNewsID(dto.getId());
        newsletter.setTitle(dto.getTitle());
        newsletter.setContent(dto.getContent());
        newsletter.setTarget(dto.getTarget());

        if (dto.getUsername() != null) {
            Employee creator =
                employeeRepository.findByUsername(dto.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            newsletter.setCreatedBy(creator);
        }

        return newsletter;
    }
}
