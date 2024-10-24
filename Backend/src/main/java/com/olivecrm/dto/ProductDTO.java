package com.olivecrm.dto;

public class ProductDTO {
    private Integer pid;
    private Double individualPrice;
    private String productName;
    private String productVariant;

    public ProductDTO(Integer pid, Double individualPrice, String productName, String productVariant) {
        this.pid = pid;
        this.individualPrice = individualPrice;
        this.productName = productName;
        this.productVariant = productVariant;
    }

    public Integer getPid() {
        return pid;
    }

    public void setPid(Integer pid) {
        this.pid = pid;
    }

    public Double getIndividualPrice() {
        return individualPrice;
    }

    public void setIndividualPrice(Double individualPrice) {
        this.individualPrice = individualPrice;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductVariant() {
        return productVariant;
    }

    public void setProductVariant(String productVariant) {
        this.productVariant = productVariant;
    }
}
