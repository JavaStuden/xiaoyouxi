package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "merchant_customer_relations")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MerchantCustomerRelation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private Long customerId;

    @Column(length = 30)
    private String status; // INVITED, ACCEPTED

    @Column(length = 60)
    private String customRemark;

    @Column(length = 255)
    private String customerTags; // JSON array: ["高净值", "爱玫瑰"]

    private Integer intimacyScore; // 好感度积分

    private LocalDateTime lastInteractAt;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (lastInteractAt == null) lastInteractAt = LocalDateTime.now();
        if (intimacyScore == null) intimacyScore = 100;
        if (status == null) status = "ACCEPTED";
    }
}
