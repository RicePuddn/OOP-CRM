package com.olivecrm.dto;

import java.util.List;

public class ProductPurchaseHistoryDTO {
    private List<Integer> purchaseCounts;
    private List<String> purchaseDates;

    // Getters and setters
    public List<Integer> getPurchaseCounts() {
        return purchaseCounts;
    }

    public void setPurchaseCounts(List<Integer> purchaseCounts) {
        this.purchaseCounts = purchaseCounts;
    }

    public List<String> getPurchaseDates() {
        return purchaseDates;
    }

    public void setPurchaseDates(List<String> purchaseDates) {
        this.purchaseDates = purchaseDates;
    }
}