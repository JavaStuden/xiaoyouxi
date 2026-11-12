package com.jianguo.controller;

import com.jianguo.common.ApiResponse;
import com.jianguo.dto.MomentDtos.*;
import com.jianguo.entity.Moment;
import com.jianguo.entity.MomentComment;
import com.jianguo.entity.VoiceRoom;
import com.jianguo.service.MomentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "4. 邂逅广场与语音房接口", description = "提供动态瀑布流多维筛选、动态发布、点赞评论以及暗色多人语音聊天室")
@RestController
@RequestMapping("/api/v1/moments")
@RequiredArgsConstructor
public class MomentController {

    private final MomentService momentService;

    @Operation(summary = "邂逅广场瀑布流 (支持性别、年龄、距离、真人认证多维筛选)")
    @GetMapping("/feed")
    public ApiResponse<List<Moment>> getFeed(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String distance,
            @RequestParam(required = false) Boolean verifiedOnly) {
        return ApiResponse.success(momentService.getEncounterFeed(gender, minAge, maxAge, distance, verifiedOnly));
    }

    @Operation(summary = "发布动态 (支持多图与定位)")
    @PostMapping("/create")
    public ApiResponse<Moment> createMoment(Authentication authentication, @RequestBody CreateMomentRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("动态发布成功", momentService.createMoment(userId, req));
    }

    @Operation(summary = "为动态点赞")
    @PostMapping("/{momentId}/like")
    public ApiResponse<Moment> likeMoment(@PathVariable Long momentId) {
        return ApiResponse.success("点赞成功", momentService.likeMoment(momentId));
    }

    @Operation(summary = "获取动态评论列表")
    @GetMapping("/{momentId}/comments")
    public ApiResponse<List<MomentComment>> getComments(@PathVariable Long momentId) {
        return ApiResponse.success(momentService.getComments(momentId));
    }

    @Operation(summary = "发表评论")
    @PostMapping("/comment")
    public ApiResponse<MomentComment> addComment(Authentication authentication, @RequestBody AddCommentRequest req) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.success("评论成功", momentService.addComment(userId, req));
    }

    @Operation(summary = "获取当前活跃的语音聊天房间列表")
    @GetMapping("/voice-rooms")
    public ApiResponse<List<VoiceRoom>> getVoiceRooms() {
        return ApiResponse.success(momentService.getVoiceRooms());
    }
}
