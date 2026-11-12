package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.MerchantDtos.*;
import com.jianguo.entity.GiftWallRecord;
import com.jianguo.service.MerchantService;
import com.jianguo.service.MerchantService.CustomerDetailView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "6. 商户端私域闭环接口", description = "提供商户客户管理、备注标签、定向送礼点赞、礼物墙与好感度排行榜")
@RestController
@RequestMapping("/api/v1/merchant")
@RequiredArgsConstructor
public class MerchantController {

    private final MerchantService merchantService;

    @Operation(summary = "商户获取客户档案列表 (包含好感度积分、标签及备注)")
    @GetMapping("/customers")
    public ApiResponse<List<CustomerDetailView>> getCustomers(Authentication authentication) {
        Long merchantId = (Long) authentication.getPrincipal();
        return ApiResponse.success(merchantService.getCustomers(merchantId));
    }

    @Operation(summary = "商户修改客户备注名与个性化标签")
    @PutMapping("/customer-remark")
    public ApiResponse<Void> updateCustomerRemark(
            Authentication authentication,
            @RequestBody UpdateCustomerRemarkRequest req) {
        Long merchantId = (Long) authentication.getPrincipal();
        merchantService.updateCustomerRemark(merchantId, req);
        return ApiResponse.success("客户备注与标签已更新", null);
    }

    @Operation(summary = "商户邀请新客户开通专属果园")
    @PostMapping("/invite-customer")
    public ApiResponse<Void> inviteCustomer(
            Authentication authentication,
            @RequestBody InviteCustomerRequest req) {
        Long merchantId = (Long) authentication.getPrincipal();
        merchantService.inviteCustomer(merchantId, req);
        return ApiResponse.success("邀请已发出，等待客户同意开通", null);
    }

    @Operation(summary = "商户向达成消费/互动的客户赠送礼物/点赞")
    @PostMapping("/reward-customer")
    public ApiResponse<Void> rewardCustomer(
            Authentication authentication,
            @RequestBody MerchantGiftRewardRequest req) {
        Long merchantId = (Long) authentication.getPrincipal();
        merchantService.merchantRewardCustomer(merchantId, req);
        return ApiResponse.success("奖励赠礼成功，好感度已提升", null);
    }

    @Operation(summary = "获取商户礼物墙")
    @GetMapping("/gift-wall")
    public ApiResponse<List<GiftWallRecord>> getGiftWall(Authentication authentication) {
        Long merchantId = (Long) authentication.getPrincipal();
        return ApiResponse.success(merchantService.getGiftWall(merchantId));
    }

    @Operation(summary = "获取商户-客户好感度排行榜")
    @GetMapping("/leaderboard/intimacy")
    public ApiResponse<List<CustomerDetailView>> getLeaderboard(Authentication authentication) {
        Long merchantId = (Long) authentication.getPrincipal();
        return ApiResponse.success(merchantService.getLeaderboard(merchantId));
    }
}
