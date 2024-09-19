package com.olivecrm.controller;

public class Customer {
    private String customerName;
    private int customerID;
    private String customerAddress;

    public Customer()
    {
        this.customerName = "placeHolder Name";
        this.customerID = 0;
        this.customerAddress = "placeHolder Address";
    }
    public Customer(String customerName, int customerID, String customerAddress) {
        this.customerName = customerName;
        this.customerID = customerID;
        this.customerAddress = customerAddress;

    }
}
