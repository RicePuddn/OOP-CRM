package com.olivecrm.dto;

public class TopProductDTO {
    private Integer pID;
    private String productName;
    private long totalQuantity;
    private double individualPrice;

    // Constructors
    public TopProductDTO() {
    }

    public TopProductDTO(Integer pID, String productName, long totalQuantity, double individualPrice) {
        this.pID = pID;
        this.productName = productName;
        this.totalQuantity = totalQuantity;
        this.individualPrice = individualPrice;
    }

    // Getters and Setters
    public Integer getPID() {
        return pID;
    }

    public void setPID(Integer pID) {
        this.pID = pID;
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

    public double getIndividualPrice() {
        return individualPrice;
    }

    public void setIndividualPrice(double individualPrice) {
        this.individualPrice = individualPrice;
    }
}
