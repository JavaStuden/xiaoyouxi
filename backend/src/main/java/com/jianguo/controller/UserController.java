package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.AuthDtos.UpdateProfileRequest;
import com.jianguo.dto.WalletDtos.AddressRequest;
import com.jianguo.entity.DailyTask;
import com.jianguo.entity.ShippingAddress;
import com.jianguo.entity.User;
import com.jianguo.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "7. 个人中心与收货地址接口", description = "提供用户个人信息、VIP升级、收货地址管理及成长任务领取")
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/profile")
    public ApiResponse<User> getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(userService.getProfile(userId));
    }

    @Operation(summary = "完善/修改个人信息 (头像、昵称、生日、性别、星座、简介)")
    @PutMapping("/profile")
    public ApiResponse<User> updateProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("资料更新成功", userService.updateProfile(userId, req));
    }

    @Operation(summary = "开通/升级会员 (1:VIP, 2:SVIP, 3:黑金会员)")
    @PostMapping("/upgrade-vip")
    public ApiResponse<User> upgradeVip(
            Authentication authentication,
            @RequestParam int level) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("会员开通成功，尊享多重特权", userService.upgradeVip(userId, level));
    }

    @Operation(summary = "获取用户收货地址列表")
    @GetMapping("/addresses")
    public ApiResponse<List<ShippingAddress>> getAddresses(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(userService.getAddresses(userId));
    }

    @Operation(summary = "保存/编辑收货地址")
    @PostMapping("/addresses")
    public ApiResponse<ShippingAddress> saveAddress(
            Authentication authentication,
            @RequestBody AddressRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("地址保存成功", userService.saveAddress(userId, req));
    }

    @Operation(summary = "删除收货地址")
    @DeleteMapping("/addresses/{id}")
    public ApiResponse<Void> deleteAddress(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = (Long) authentication.getPrincipal();
        userService.deleteAddress(userId, id);
        return ApiResponse.success("地址已删除", null);
    }

    @Operation(summary = "获取每日任务与成长任务")
    @GetMapping("/tasks")
    public ApiResponse<List<DailyTask>> getTasks(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(userService.getTasks(userId));
    }

    @Operation(summary = "领取任务金币奖励")
    @PostMapping("/tasks/{taskId}/claim")
    public ApiResponse<Void> claimTask(
            Authentication authentication,
            @PathVariable Long taskId) {
        Long userId = (Long) authentication.getPrincipal();
        userService.claimTaskReward(userId, taskId);
        return ApiResponse.success("任务奖励领取成功！", null);
    }
}
