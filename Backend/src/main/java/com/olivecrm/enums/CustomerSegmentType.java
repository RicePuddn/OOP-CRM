package com.olivecrm.enums;

public enum CustomerSegmentType {
    // Recency - based on last purchase
    ACTIVE("Active - Purchased within last 30 days", "Recency"),
    DORMANT("Dormant - No purchase in last 6 months", "Recency"),
    RETURNING("Returning - First purchase in over a year", "Recency"),

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
