package com.olivecrm.dto;

import java.util.List;

public class CustomerSegmentDTO {
    private List<Integer> customerIds;
    private String segmentType;
    private String segmentCategory;

    public CustomerSegmentDTO(List<Integer> customerIds, String segmentType, String segmentCategory) {
        this.customerIds = customerIds;
        this.segmentType = segmentType;
        this.segmentCategory = segmentCategory;
    }

    public List<Integer> getCustomerIds() {
        return customerIds;
    }

    public void setCustomerIds(List<Integer> customerIds) {
        this.customerIds = customerIds;
    }

    public String getSegmentType() {
        return segmentType;
    }

    public void setSegmentType(String segmentType) {
        this.segmentType = segmentType;
    }

    public String getSegmentCategory() {
        return segmentCategory;
    }

    public void setSegmentCategory(String segmentCategory) {
        this.segmentCategory = segmentCategory;
    }
}
