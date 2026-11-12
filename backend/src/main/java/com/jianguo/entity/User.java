package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false, length = 20)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(length = 20)
    private String role; // CONSUMER, MERCHANT, ADMIN

    @Column(length = 50)
    private String nickname;

    @Column(length = 512)
    private String avatarUrl;

    private Integer gender; // 0:未知, 1:男, 2:女

    private LocalDate birthday;

    @Column(length = 20)
    private String zodiacSign;

    @Column(length = 255)
    private String bio;

    private Boolean realPersonVerified;

    private Integer vipLevel; // 0:普通, 1:VIP, 2:SVIP, 3:黑金会员

    private LocalDateTime vipExpireAt;

    private BigDecimal coinBalance;

    private Integer flowerBalance;

    private Boolean gardenActivated;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (updatedAt == null) updatedAt = LocalDateTime.now();
        if (coinBalance == null) coinBalance = new BigDecimal("888.00");
        if (flowerBalance == null) flowerBalance = 20;
        if (vipLevel == null) vipLevel = 0;
        if (realPersonVerified == null) realPersonVerified = false;
        if (role == null) role = "CONSUMER";
        if (gardenActivated == null) gardenActivated = true;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
