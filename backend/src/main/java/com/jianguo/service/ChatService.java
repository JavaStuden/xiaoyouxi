package com.jianguo.service;

import com.jianguo.dto.ChatDtos.*;
import com.jianguo.entity.ChatMessage;
import com.jianguo.entity.User;
import com.jianguo.repository.ChatMessageRepository;
import com.jianguo.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository messageRepository;
    private final UserRepository userRepository;

    @Data
    @Builder
    public static class ChatConversationView {
        private Long contactUserId;
        private String contactName;
        private String contactAvatar;
        private String role;
        private String lastMessage;
        private String lastMessageTime;
        private int unreadCount;
    }

    public List<ChatMessage> getHistory(Long currentUserId, Long targetUserId) {
        return messageRepository.findChatHistory(currentUserId, targetUserId);
    }

    @Transactional
    public ChatMessage sendMessage(Long senderId, SendMessageRequest req) {
        ChatMessage msg = ChatMessage.builder()
                .senderId(senderId)
                .receiverId(req.getReceiverId())
                .messageType(req.getMessageType() != null ? req.getMessageType() : "TEXT")
                .content(req.getContent())
                .voiceDuration(req.getVoiceDuration())
                .giftName(req.getGiftName())
                .giftIcon(req.getGiftIcon())
                .giftCost(req.getGiftCost())
                .isRead(false)
                .build();

        return messageRepository.save(msg);
    }

    @Transactional
    public ChatMessage sendGift(Long senderId, SendGiftRequest req) {
        User sender = userRepository.findById(senderId).orElseThrow();
        BigDecimal totalCost = req.getGiftCost().multiply(new BigDecimal(req.getGiftCount() != null ? req.getGiftCount() : 1));

        if (sender.getCoinBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("金币余额不足，赠送该礼物需要 " + totalCost + " 金币");
        }

        sender.setCoinBalance(sender.getCoinBalance().subtract(totalCost));
        userRepository.save(sender);

        ChatMessage giftMsg = ChatMessage.builder()
                .senderId(senderId)
                .receiverId(req.getReceiverId())
                .messageType("GIFT")
                .content("赠送了 [" + req.getGiftName() + "] x" + (req.getGiftCount() != null ? req.getGiftCount() : 1))
                .giftName(req.getGiftName())
                .giftIcon(req.getGiftIcon())
                .giftCost(totalCost)
                .isRead(false)
                .build();

        return messageRepository.save(giftMsg);
    }

    public List<ChatConversationView> getConversations(Long currentUserId) {
        List<ChatMessage> all = messageRepository.findUserAllMessages(currentUserId);
        Map<Long, ChatMessage> latestByContact = new LinkedHashMap<>();

        for (ChatMessage m : all) {
            Long contactId = m.getSenderId().equals(currentUserId) ? m.getReceiverId() : m.getSenderId();
            if (!latestByContact.containsKey(contactId)) {
                latestByContact.put(contactId, m);
            }
        }

        List<ChatConversationView> list = new ArrayList<>();
        for (Map.Entry<Long, ChatMessage> entry : latestByContact.entrySet()) {
            Long contactId = entry.getKey();
            ChatMessage msg = entry.getValue();
            User contact = userRepository.findById(contactId).orElse(null);
            if (contact != null) {
                list.add(ChatConversationView.builder()
                        .contactUserId(contact.getUserId())
                        .contactName(contact.getNickname())
                        .contactAvatar(contact.getAvatarUrl())
                        .role(contact.getRole())
                        .lastMessage(msg.getContent())
                        .lastMessageTime(msg.getCreatedAt().toString())
                        .unreadCount(msg.getSenderId().equals(contactId) && Boolean.FALSE.equals(msg.getIsRead()) ? 1 : 0)
                        .build());
            }
        }
        return list;
    }
}
