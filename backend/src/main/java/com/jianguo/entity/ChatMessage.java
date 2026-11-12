package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long senderId;

    @Column(nullable = false)
    private Long receiverId;

    @Column(length = 20)
    private String messageType; // TEXT, VOICE, IMAGE, GIFT

    @Column(length = 2000)
    private String content;

    private Integer voiceDuration; // 语音秒数

    private String giftName;

    private String giftIcon;

    private BigDecimal giftCost;

    private Boolean isRead;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (isRead == null) isRead = false;
        if (messageType == null) messageType = "TEXT";
    }
}
