package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.AuthDtos.*;
import com.jianguo.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "1. 用户与认证接口", description = "提供用户注册、验证码发送、密码登录、快捷登录及密码找回")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "用户注册 (手机号+验证码+密码)")
    @PostMapping("/register")
    public ApiResponse<AuthResponse> register(@RequestBody RegisterRequest req) {
        return ApiResponse.success("注册成功", authService.register(req));
    }

    @Operation(summary = "用户登录 (密码或验证码快捷登录)")
    @PostMapping("/login")
    public ApiResponse<AuthResponse> login(@RequestBody LoginRequest req) {
        return ApiResponse.success("登录成功", authService.login(req));
    }

    @Operation(summary = "发送短信验证码 (开发环境默认验证码: 888888)")
    @PostMapping("/send-sms-code")
    public ApiResponse<Map<String, String>> sendSmsCode(@RequestParam String phone) {
        return ApiResponse.success("验证码发送成功", Map.of("phone", phone, "code", "888888"));
    }

    @Operation(summary = "找回/重设密码")
    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ApiResponse.success("密码修改成功", null);
    }
}
