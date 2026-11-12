package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "daily_tasks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 50)
    private String taskCode;

    @Column(length = 100)
    private String title;

    @Column(length = 255)
    private String description;

    private BigDecimal rewardCoins;

    private String rewardType; // COIN, FLOWER, PROP

    private Boolean isCompleted;

    private Boolean isClaimed;
}
