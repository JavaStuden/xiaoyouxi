package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.WalletDtos.RechargeRequest;
import com.jianguo.entity.User;
import com.jianguo.entity.WalletTransaction;
import com.jianguo.service.WalletService;
import com.jianguo.service.WalletService.RechargePackage;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "8. 钱包充值与账单接口", description = "提供金币充值套餐、充值支付及交易账单明细筛选")
@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @Operation(summary = "获取代币充值阶梯档位 (6元/30元/98元/298元/648元)")
    @GetMapping("/packages")
    public ApiResponse<List<RechargePackage>> getPackages() {
        return ApiResponse.success(walletService.getRechargePackages());
    }

    @Operation(summary = "提交充值订单并即时到账")
    @PostMapping("/recharge")
    public ApiResponse<User> recharge(
            Authentication authentication,
            @RequestBody RechargeRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("充值成功，金币已到账！", walletService.executeRecharge(userId, req));
    }

    @Operation(summary = "查询交易账单流水 (type可选: ALL, RECHARGE, CONSUME)")
    @GetMapping("/transactions")
    public ApiResponse<List<WalletTransaction>> getTransactions(
            Authentication authentication,
            @RequestParam(required = false, defaultValue = "ALL") String type) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(walletService.getTransactions(userId, type));
    }
}
