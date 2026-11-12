package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long itemId;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(length = 30)
    private String itemType; // SEED, FERTILIZER, PEST_SPRAY, WATER_CAN, BOUQUET, DECORATION

    @Column(length = 255)
    private String description;

    private BigDecimal price;

    @Column(length = 512)
    private String iconUrl;

    private Integer matureTimeSeconds; // 生长成熟周期(秒)

    private Integer yieldCount; // 产出数量
}
