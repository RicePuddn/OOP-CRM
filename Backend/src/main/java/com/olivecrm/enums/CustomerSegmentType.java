package com.olivecrm.enums;

public enum CustomerSegmentType {
    // Recency
    ACTIVE("Active", "Recency"),
    DORMANT("Dormant", "Recency"),
    RETURNING("Returning", "Recency"),

    // Frequency
    FREQUENT("Frequent", "Frequency"),
    OCCASIONAL("Occasional", "Frequency"),
    ONE_TIME("One-time", "Frequency"),

    // Monetary
    HIGH_VALUE("High-Value", "Monetary"),
    MID_TIER("Mid-Tier", "Monetary"),
    LOW_SPEND("Low-Spend", "Monetary");

    private final String label;
    private final String category;

    CustomerSegmentType(String label, String category) {
        this.label = label;
        this.category = category;
    }

    public String getLabel() {
        return label;
    }

    public String getCategory() {
        return category;
    }
}
