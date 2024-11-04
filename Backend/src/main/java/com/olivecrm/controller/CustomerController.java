package com.olivecrm.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.olivecrm.dto.CustomerSegmentDTO;
import com.olivecrm.entity.Customer;
import com.olivecrm.service.CustomerService;
import com.olivecrm.service.OrderService;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired private CustomerService customerService;
    @Autowired private OrderService orderService;

    @GetMapping("/name/{cid}")
    public ResponseEntity<String>
    getCustomerNameById(@PathVariable("cid") int cid) {
        Optional<Customer> customerOptional =
            customerService.findCustomerById(cid);
        if (customerOptional.isPresent()) {
            Customer customer = customerOptional.get();
            String fullName =
                customer.getFirst_name() + " " + customer.getLast_name();
            return ResponseEntity.ok(fullName);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/retrieve")
    public ResponseEntity<List<Customer>> getAllCustomerIds() {
        List<Customer> customers = customerService.findAllCustomers();
        return ResponseEntity.ok(customers);
    }

    @GetMapping("/segment")
    public ResponseEntity<List<Customer>>
    getCustomersBySegment(@RequestParam String segmentType) {
        List<Integer> customerIds;
        switch (segmentType.toUpperCase()) {
        case "ACTIVE":
            customerIds = orderService.getActiveCustomers().getCustomerIds();
            break;
        case "DORMANT":
            customerIds = orderService.getDormantCustomers().getCustomerIds();
            break;
        case "RETURNING":
            customerIds = orderService.getReturningCustomers().getCustomerIds();
            break;
        case "FREQUENT":
            customerIds = orderService.getFrequentCustomers().getCustomerIds();
            break;
        case "OCCASIONAL":
            customerIds =
                orderService.getOccasionalCustomers().getCustomerIds();
            break;
        case "ONETIME":
            customerIds = orderService.getOneTimeCustomers().getCustomerIds();
            break;
        case "HIGHVALUE":
            customerIds = orderService.getMonetarySegments()
                              .stream()
                              .filter(segment
                                      -> segment.getSegmentType().name().equals(
                                          "HIGH_VALUE"))
                              .findFirst()
                              .orElse(new CustomerSegmentDTO(new ArrayList<>(),
                                                             null, null))
                              .getCustomerIds();
            break;
        case "MIDTIER":
            customerIds = orderService.getMonetarySegments()
                              .stream()
                              .filter(segment
                                      -> segment.getSegmentType().name().equals(
                                          "MID_TIER"))
                              .findFirst()
                              .orElse(new CustomerSegmentDTO(new ArrayList<>(),
                                                             null, null))
                              .getCustomerIds();
            break;
        case "LOWSPEND":
            customerIds = orderService.getMonetarySegments()
                              .stream()
                              .filter(segment
                                      -> segment.getSegmentType().name().equals(
                                          "LOW_SPEND"))
                              .findFirst()
                              .orElse(new CustomerSegmentDTO(new ArrayList<>(),
                                                             null, null))
                              .getCustomerIds();
            break;

        default:
            return ResponseEntity.badRequest().build();
        }

        List<Customer> customers =
            customerService.findCustomersByIds(customerIds);
        return ResponseEntity.ok(customers);
    }
}
