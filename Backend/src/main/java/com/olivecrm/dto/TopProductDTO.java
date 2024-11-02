package com.olivecrm.dto;

public class TopProductDTO {
    private int productId;
    private String productName;
    private long totalQuantity;

    // Constructors
    public TopProductDTO() {
    }

    public TopProductDTO(int productId, String productName, long totalQuantity) {
        this.productId = productId;
        this.productName = productName;
        this.totalQuantity = totalQuantity;
    }

    // Getters and Setters
    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

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
