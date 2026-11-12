package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.ChatDtos.*;
import com.jianguo.entity.ChatMessage;
import com.jianguo.service.ChatService;
import com.jianguo.service.ChatService.ChatConversationView;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "5. 消息与即时通讯接口", description = "提供会话列表、历史记录、文本/语音消息收发及打赏礼物")
@RestController
@RequestMapping("/api/v1/im")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @Operation(summary = "获取当前用户的最近联系人会话列表")
    @GetMapping("/conversations")
    public ApiResponse<List<ChatConversationView>> getConversations(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(chatService.getConversations(userId));
    }

    @Operation(summary = "获取与指定联系人的历史聊天记录")
    @GetMapping("/history/{contactUserId}")
    public ApiResponse<List<ChatMessage>> getHistory(
            Authentication authentication,
            @PathVariable Long contactUserId) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success(chatService.getHistory(userId, contactUserId));
    }

    @Operation(summary = "发送消息 (文本 / 语音 / 图片)")
    @PostMapping("/send-message")
    public ApiResponse<ChatMessage> sendMessage(
            Authentication authentication,
            @RequestBody SendMessageRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("消息发送成功", chatService.sendMessage(userId, req));
    }

    @Operation(summary = "赠送礼物 (鲜花、跑车、皇冠并扣除代币)")
    @PostMapping("/send-gift")
    public ApiResponse<ChatMessage> sendGift(
            Authentication authentication,
            @RequestBody SendGiftRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("礼物赠送成功！", chatService.sendGift(userId, req));
    }
}
