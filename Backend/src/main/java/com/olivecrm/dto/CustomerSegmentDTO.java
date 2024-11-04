package com.olivecrm.dto;

import java.util.List;
import com.olivecrm.enums.CustomerSegmentType;

public class CustomerSegmentDTO {
    private List<Integer> customerIds;
    private CustomerSegmentType segmentType;
    private String segmentCategory;
    private int customerCount;

    public CustomerSegmentDTO(List<Integer> customerIds, CustomerSegmentType segmentType, String segmentCategory) {
        this.customerIds = customerIds;
        this.segmentType = segmentType;
        this.segmentCategory = segmentCategory;
        this.customerCount = customerIds != null ? customerIds.size() : 0;
    }

    public List<Integer> getCustomerIds() {
        return customerIds;
    }

    public void setCustomerIds(List<Integer> customerIds) {
        this.customerIds = customerIds;
        this.customerCount = customerIds != null ? customerIds.size() : 0;
    }

    public CustomerSegmentType getSegmentType() {
        return segmentType;
    }

    public void setSegmentType(CustomerSegmentType segmentType) {
        this.segmentType = segmentType;
    }

    public String getSegmentCategory() {
        return segmentCategory;
    }

    public void setSegmentCategory(String segmentCategory) {
        this.segmentCategory = segmentCategory;
    }

    public int getCustomerCount() {
        return customerCount;
    }
}
