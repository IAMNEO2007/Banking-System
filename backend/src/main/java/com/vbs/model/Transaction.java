package com.vbs.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "transactions")
public class Transaction {
    @Id
    private Long id;
    
    @Column(name = "user_id")
    private Long userId;
    
    private String type;
    
    @Column(name = "to_from")
    private String to;
    
    private String amount;
    
    @Column(name = "date_string")
    private String date;
    
    private String category;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getTo() { return to; }
    public void setTo(String to) { this.to = to; }
    
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    
    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
}
