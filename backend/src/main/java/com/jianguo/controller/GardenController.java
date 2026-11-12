package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.GardenDtos.*;
import com.jianguo.entity.GardenLand;
import com.jianguo.service.GardenService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Tag(name = "2. 花园种植核心接口", description = "提供2.5D果园土地状态、播种、浇水、除虫药剂、采摘与土地升级扩建")
@RestController
@RequestMapping("/api/v1/garden")
@RequiredArgsConstructor
public class GardenController {

    private final GardenService gardenService;

    @Operation(summary = "获取当前用户的12块果园土地完整状态")
    @GetMapping("/my-lands")
    public ApiResponse<List<GardenLand>> getMyLands(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(gardenService.getMyLands(userId));
    }

    @Operation(summary = "土地播种")
    @PostMapping("/plant")
    public ApiResponse<GardenLand> plant(Authentication authentication, @RequestBody PlantRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("播种成功，静待鲜花成长", gardenService.plantSeed(userId, req));
    }

    @Operation(summary = "土地浇水 (恢复水分充盈)")
    @PostMapping("/water")
    public ApiResponse<GardenLand> water(Authentication authentication, @RequestBody WaterRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("浇水成功，水分已充足", gardenService.water(userId, req));
    }

    @Operation(summary = "使用驱虫药剂 (扑灭害虫)")
    @PostMapping("/disinfest")
    public ApiResponse<GardenLand> disinfest(Authentication authentication, @RequestBody DisinfestRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("成功使用驱虫喷雾，害虫已全数消灭！", gardenService.disinfest(userId, req));
    }

    @Operation(summary = "成熟采摘")
    @PostMapping("/harvest")
    public ApiResponse<Map<String, Object>> harvest(Authentication authentication, @RequestBody HarvestRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        int count = gardenService.harvest(userId, req.getLandIndex());
        return ApiResponse.success("采摘成功！鲜花已放入背包", Map.of("harvestCount", count));
    }

    @Operation(summary = "升级土地 (提升土地肥力与收益)")
    @PostMapping("/upgrade-land")
    public ApiResponse<GardenLand> upgradeLand(Authentication authentication, @RequestBody UpgradeLandRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("土地升级成功", gardenService.upgradeLand(userId, req));
    }

    @Operation(summary = "购买/开垦新土地")
    @PostMapping("/purchase-land")
    public ApiResponse<GardenLand> purchaseLand(Authentication authentication, @RequestBody PurchaseLandRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("新地块开垦成功！", gardenService.purchaseLand(userId, req));
    }
}
