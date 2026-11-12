package com.jianguo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "garden_lands")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GardenLand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long landId;

    @Column(nullable = false)
    private Long userId;

    private Integer landIndex; // 1 to 12

    private Integer landLevel; // 1, 2, 3 (红土地、黑土地、金土地)

    @Column(length = 30)
    private String status; // LOCKED, EMPTY, GROWING, MATURE, PEST_INFESTED

    private Long currentSeedId;

    @Column(length = 50)
    private String plantName;

    private LocalDateTime plantedAt;

    private Integer currentStage; // 1: 幼苗期, 2: 抽枝期, 3: 孕蕾期, 4: 开花期, 5: 成熟期

    private Integer moistureVal; // 0 to 100

    private Boolean hasPest; // 是否生虫

    private LocalDateTime expectedMatureAt;

    private Integer estimatedYield;

    @PrePersist
    public void prePersist() {
        if (landLevel == null) landLevel = 1;
        if (status == null) status = "EMPTY";
        if (currentStage == null) currentStage = 0;
        if (moistureVal == null) moistureVal = 85;
        if (hasPest == null) hasPest = false;
        if (estimatedYield == null) estimatedYield = 5;
    }
}
