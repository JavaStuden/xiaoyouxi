package com.jianguo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

public class AuthDtos {

    @Data
    public static class LoginRequest {
        private String phone;
        private String password;
        private String code; // 验证码免密登录选填
    }

    @Data
    public static class RegisterRequest {
        private String phone;
        private String password;
        private String code;
        private String role; // CONSUMER or MERCHANT
        private String nickname;
    }

    @Data
    public static class ResetPasswordRequest {
        private String phone;
        private String code;
        private String newPassword;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AuthResponse {
        private String token;
        private Long userId;
        private String phone;
        private String role;
        private String nickname;
        private String avatarUrl;
        private Integer vipLevel;
        private BigDecimal coinBalance;
        private Integer flowerBalance;
        private Boolean gardenActivated;
    }

    @Data
    public static class UpdateProfileRequest {
        private String nickname;
        private String avatarUrl;
        private Integer gender;
        private LocalDate birthday;
        private String zodiacSign;
        private String bio;
    }
}
