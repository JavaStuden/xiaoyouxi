package com.jianguo.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jianguo.dto.MomentDtos.*;
import com.jianguo.entity.Moment;
import com.jianguo.entity.MomentComment;
import com.jianguo.entity.User;
import com.jianguo.entity.VoiceRoom;
import com.jianguo.repository.MomentCommentRepository;
import com.jianguo.repository.MomentRepository;
import com.jianguo.repository.UserRepository;
import com.jianguo.repository.VoiceRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MomentService {

    private final MomentRepository momentRepository;
    private final MomentCommentRepository commentRepository;
    private final UserRepository userRepository;
    private final VoiceRoomRepository voiceRoomRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Moment> getEncounterFeed(String gender, Integer minAge, Integer maxAge, String distance, Boolean verifiedOnly) {
        List<Moment> all = momentRepository.findAllByOrderByCreatedAtDesc();
        if (verifiedOnly != null && verifiedOnly) {
            all = all.stream().filter(m -> Boolean.TRUE.equals(m.getAuthorRealVerified())).toList();
        }
        return all;
    }

    @Transactional
    public Moment createMoment(Long userId, CreateMomentRequest req) {
        User user = userRepository.findById(userId).orElseThrow();
        String mediaJson = "[]";
        try {
            if (req.getMediaUrls() != null) {
                mediaJson = objectMapper.writeValueAsString(req.getMediaUrls());
            }
        } catch (Exception ignored) {}

        Moment moment = Moment.builder()
                .userId(userId)
                .authorName(user.getNickname())
                .authorAvatar(user.getAvatarUrl())
                .authorVipLevel(user.getVipLevel())
                .authorRealVerified(user.getRealPersonVerified())
                .content(req.getContent())
                .mediaUrls(mediaJson)
                .locationName(req.getLocationName() != null ? req.getLocationName() : "鲜花谷生态农庄")
                .likeCount(0)
                .commentCount(0)
                .build();

        return momentRepository.save(moment);
    }

    @Transactional
    public Moment likeMoment(Long momentId) {
        Moment m = momentRepository.findById(momentId)
                .orElseThrow(() -> new IllegalArgumentException("动态不存在"));
        m.setLikeCount(m.getLikeCount() + 1);
        return momentRepository.save(m);
    }

    public List<MomentComment> getComments(Long momentId) {
        return commentRepository.findByMomentIdOrderByCreatedAtAsc(momentId);
    }

    @Transactional
    public MomentComment addComment(Long userId, AddCommentRequest req) {
        User user = userRepository.findById(userId).orElseThrow();
        Moment moment = momentRepository.findById(req.getMomentId())
                .orElseThrow(() -> new IllegalArgumentException("动态不存在"));

        MomentComment comment = MomentComment.builder()
                .momentId(moment.getMomentId())
                .userId(userId)
                .userName(user.getNickname())
                .userAvatar(user.getAvatarUrl())
                .content(req.getContent())
                .build();

        comment = commentRepository.save(comment);

        moment.setCommentCount(moment.getCommentCount() + 1);
        momentRepository.save(moment);

        return comment;
    }

    public List<VoiceRoom> getVoiceRooms() {
        return voiceRoomRepository.findAllByOrderByOnlineCountDesc();
    }
}
