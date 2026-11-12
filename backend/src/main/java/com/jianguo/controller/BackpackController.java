package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.service.BackpackService;
import com.jianguo.service.BackpackService.BackpackItemView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "3. 背包与商城接口", description = "提供用户背包道具、成熟花束资产、商城购买功能")
@RestController
@RequestMapping("/api/v1/backpack")
@RequiredArgsConstructor
public class BackpackController {

    private final BackpackService backpackService;

    @Operation(summary = "获取用户背包道具与花束 (type可选: SEED, FERTILIZER, PEST_SPRAY, BOUQUET)")
    @GetMapping("/my-items")
    public ApiResponse<List<BackpackItemView>> getMyItems(
            Authentication authentication,
            @RequestParam(required = false) String type) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(backpackService.getUserBackpack(userId, type));
    }

    @Operation(summary = "商城购买道具或花种")
    @PostMapping("/buy")
    public ApiResponse<Void> buyItem(
            Authentication authentication,
            @RequestParam Long itemId,
            @RequestParam(defaultValue = "1") int quantity) {
        Long userId = (Long) authentication.getPrincipal();
        backpackService.buyItem(userId, itemId, quantity);
        return ApiResponse.success("购买成功，已放入背包", null);
    }
}
