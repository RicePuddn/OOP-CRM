package com.olivecrm.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "CUSTOMER")
public class Customer {

    @Id
    private int cID;
    private String zipcode;

    // Getters and setters
    public int getCID() {
        return cID;
    }

    public void setCID(int cID) {
        this.cID = cID;
    }

    public String getZipcode() {
        return zipcode;
    }

    public void setZipcode(String zipcode) {
        this.zipcode = zipcode;
    }
}
