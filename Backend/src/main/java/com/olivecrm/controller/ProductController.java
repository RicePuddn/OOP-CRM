package com.olivecrm.controller;

import com.olivecrm.dto.ProductDTO;
import com.olivecrm.entity.Product;
import com.olivecrm.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productRepository.findAll().stream()
            .map(product -> new ProductDTO(
                product.getPID(),
                product.getIndividualPrice(),
                product.getProductName(),
                product.getProductVariant()
            ))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(products);
    }
}
