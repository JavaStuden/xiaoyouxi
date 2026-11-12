package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "moments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Moment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long momentId;

    @Column(nullable = false)
    private Long userId;

    private String authorName;

    private String authorAvatar;

    private Integer authorVipLevel;

    private Boolean authorRealVerified;

    @Column(length = 2000)
    private String content;

    @Column(length = 2000)
    private String mediaUrls; // JSON array of image URLs

    private String locationName;

    private Integer likeCount;

    private Integer commentCount;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = LocalDateTime.now();
        if (likeCount == null) likeCount = 0;
        if (commentCount == null) commentCount = 0;
        if (authorVipLevel == null) authorVipLevel = 0;
        if (authorRealVerified == null) authorRealVerified = false;
    }
}
