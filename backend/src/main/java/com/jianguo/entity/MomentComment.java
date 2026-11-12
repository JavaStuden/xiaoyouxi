package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "moment_comments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MomentComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long momentId;

    @Column(nullable = false)
    private Long userId;

    private String userName;

    private String userAvatar;

    @Column(length = 500)
    private String content;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
