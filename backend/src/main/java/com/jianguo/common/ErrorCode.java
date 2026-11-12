package com.jianguo.common;

import lombok.Getter;

@Getter
public enum ErrorCode {
    SUCCESS(200, "操作成功"),
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "尚未登录或登录已失效"),
    FORBIDDEN(403, "无权限访问此资源"),
    NOT_FOUND(404, "请求的资源不存在"),
    USER_ALREADY_EXISTS(4001, "该手机号已被注册"),
    USER_NOT_FOUND(4002, "用户不存在"),
    INVALID_PASSWORD(4003, "密码错误"),
    VERIFICATION_CODE_INVALID(4004, "验证码无效或已过期"),
    INSUFFICIENT_COINS(5001, "金币余额不足"),
    LAND_LOCKED(5002, "该地块尚未解锁"),
    LAND_OCCUPIED(5003, "该地块已有作物在生长"),
    LAND_EMPTY(5004, "该地块暂无作物"),
    PLANT_NOT_MATURE(5005, "作物尚未成熟，无法采摘"),
    ITEM_NOT_FOUND(5006, "背包中无该道具"),
    PEST_CLEARED(5007, "该地块无需驱虫"),
    SYSTEM_ERROR(5000, "系统内部繁忙，请稍后再试");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
