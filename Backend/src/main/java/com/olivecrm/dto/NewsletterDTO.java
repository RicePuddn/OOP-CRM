package com.olivecrm.dto;


public class NewsletterDTO {
    private int id; 
    private String title;
    private String content;
    private String target;
    private String username; 


    public int getId() { return id; }

    public void setId(int id) { this.id = id; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public String getTarget() { return target; }

    public void setTarget(String target) { this.target = target; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }
}

