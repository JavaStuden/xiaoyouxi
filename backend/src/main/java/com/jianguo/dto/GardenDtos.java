package com.jianguo.dto;

import lombok.Data;

public class GardenDtos {

    @Data
    public static class PlantRequest {
        private Integer landIndex;
        private Long seedId;
    }

    @Data
    public static class WaterRequest {
        private Integer landIndex;
    }

    @Data
    public static class DisinfestRequest {
        private Integer landIndex;
    }

    @Data
    public static class HarvestRequest {
        private Integer landIndex;
    }

    @Data
    public static class UpgradeLandRequest {
        private Integer landIndex;
    }

    @Data
    public static class PurchaseLandRequest {
        private Integer landIndex;
    }
}
