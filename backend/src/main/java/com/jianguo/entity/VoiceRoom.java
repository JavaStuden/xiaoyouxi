package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "voice_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoiceRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    @Column(nullable = false, length = 100)
    private String title;

    private Long hostId;

    private String hostName;

    private String hostAvatar;

    private Integer onlineCount;

    @Column(length = 500)
    private String announcement;

    @Column(length = 2000)
    private String activeSeatsJson; // 8 麦位当前发言者信息

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (onlineCount == null) onlineCount = 1;
    }
}
