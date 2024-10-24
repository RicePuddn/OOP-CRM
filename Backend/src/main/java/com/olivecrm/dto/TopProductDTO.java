package com.olivecrm.dto;

public class TopProductDTO {
    private String productName;
    private long totalQuantity;

    // Constructors
    public TopProductDTO() {
    }

    public TopProductDTO(String productName, long totalQuantity) {
        this.productName = productName;
        this.totalQuantity = totalQuantity;
    }

    // Getters and Setters
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public long getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(long totalQuantity) {
        this.totalQuantity = totalQuantity;
    }
}
