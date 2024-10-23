package com.olivecrm.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "NEWSLETTER")
public class Newsletter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "newsID")
    private Integer newsID;

    @Column(name = "title", nullable = false) private String title;

    @Column(name = "content", nullable = false) private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "username", nullable = false)
    private Employee createdBy;

    public Integer getNewsID() { return newsID; }

    public void setNewsID(Integer newsID) { this.newsID = newsID; }

    public String getTitle() { return title; }

    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public Employee getCreatedBy() { return createdBy; }

    public void setCreatedBy(Employee createdBy) { this.createdBy = createdBy; }
}
