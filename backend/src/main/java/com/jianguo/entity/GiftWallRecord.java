package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "gift_wall_records")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiftWallRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long merchantId;

    @Column(nullable = false)
    private Long customerId;

    private String customerName;

    private String customerAvatar;

    private String giftName;

    private String giftIcon;

    private Integer giftCount;

    private BigDecimal amount;

    @Column(length = 30)
    private String direction; // CUSTOMER_TO_MERCHANT, MERCHANT_TO_CUSTOMER

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (giftCount == null) giftCount = 1;
    }
}
