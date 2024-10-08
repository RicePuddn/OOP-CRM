package com.olivecrm.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
@Table(name = "EMPLOYEES")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int eID;
    private String username;
    private String password;
    private String employeeName;
    private String role;

    @Enumerated(EnumType.STRING)
    private Team team;

    public enum Team {
        Marketing, Sales, System_Administrator
    }

    // Getters and setters
    public int getEID() {
        return eID;
    }

    public void setEID(int eID) {
        this.eID = eID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}