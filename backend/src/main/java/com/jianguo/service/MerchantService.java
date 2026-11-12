package com.jianguo.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jianguo.dto.MerchantDtos.*;
import com.jianguo.entity.*;
import com.jianguo.repository.*;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MerchantService {

    private final MerchantCustomerRelationRepository relationRepository;
    private final GiftWallRecordRepository giftWallRepository;
    private final UserRepository userRepository;
    private final MomentRepository momentRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Data
    @Builder
    public static class CustomerDetailView {
        private Long relationId;
        private Long customerId;
        private String phone;
        private String nickname;
        private String avatarUrl;
        private String customRemark;
        private List<String> tags;
        private Integer intimacyScore;
        private String status;
        private LocalDateTime lastInteractAt;
    }

    public List<CustomerDetailView> getCustomers(Long merchantId) {
        List<MerchantCustomerRelation> relations = relationRepository.findByMerchantIdOrderByIntimacyScoreDesc(merchantId);
        List<CustomerDetailView> views = new ArrayList<>();
        for (MerchantCustomerRelation r : relations) {
            User customer = userRepository.findById(r.getCustomerId()).orElse(null);
            if (customer != null) {
                List<String> tags = new ArrayList<>();
                try {
                    if (r.getCustomerTags() != null) {
                        tags = objectMapper.readValue(r.getCustomerTags(), List.class);
                    }
                } catch (Exception ignored) {}

                views.add(CustomerDetailView.builder()
                        .relationId(r.getId())
                        .customerId(customer.getUserId())
                        .phone(customer.getPhone())
                        .nickname(customer.getNickname())
                        .avatarUrl(customer.getAvatarUrl())
                        .customRemark(r.getCustomRemark() != null ? r.getCustomRemark() : customer.getNickname())
                        .tags(tags)
                        .intimacyScore(r.getIntimacyScore())
                        .status(r.getStatus())
                        .lastInteractAt(r.getLastInteractAt())
                        .build());
            }
        }
        return views;
    }

    @Transactional
    public void updateCustomerRemark(Long merchantId, UpdateCustomerRemarkRequest req) {
        MerchantCustomerRelation relation = relationRepository.findByMerchantIdAndCustomerId(merchantId, req.getCustomerId())
                .orElseThrow(() -> new IllegalArgumentException("尚未与该客户建立联系"));

        if (req.getCustomRemark() != null) {
            relation.setCustomRemark(req.getCustomRemark());
        }
        if (req.getCustomerTags() != null) {
            try {
                relation.setCustomerTags(objectMapper.writeValueAsString(req.getCustomerTags()));
            } catch (Exception ignored) {}
        }
        relationRepository.save(relation);
    }

    @Transactional
    public void inviteCustomer(Long merchantId, InviteCustomerRequest req) {
        User customer = userRepository.findByPhone(req.getCustomerPhone())
                .orElseThrow(() -> new IllegalArgumentException("未找到该手机号的用户"));

        if (relationRepository.findByMerchantIdAndCustomerId(merchantId, customer.getUserId()).isPresent()) {
            throw new IllegalArgumentException("该用户已在您的客户列表中");
        }

        MerchantCustomerRelation r = MerchantCustomerRelation.builder()
                .merchantId(merchantId)
                .customerId(customer.getUserId())
                .status("INVITED")
                .customRemark(customer.getNickname())
                .customerTags("[\"新客户\", \"鲜花爱好者\"]")
                .intimacyScore(50)
                .build();
        relationRepository.save(r);
    }

    @Transactional
    public void merchantRewardCustomer(Long merchantId, MerchantGiftRewardRequest req) {
        User customer = userRepository.findById(req.getCustomerId()).orElseThrow();
        User merchant = userRepository.findById(merchantId).orElseThrow();

        GiftWallRecord record = GiftWallRecord.builder()
                .merchantId(merchantId)
                .customerId(customer.getUserId())
                .customerName(customer.getNickname())
                .customerAvatar(customer.getAvatarUrl())
                .giftName(req.getGiftName())
                .giftIcon(req.getGiftIcon())
                .giftCount(1)
                .amount(req.getAmount() != null ? req.getAmount() : new BigDecimal("50.00"))
                .direction("MERCHANT_TO_CUSTOMER")
                .build();
        giftWallRepository.save(record);

        // 增加好感度积分
        relationRepository.findByMerchantIdAndCustomerId(merchantId, customer.getUserId()).ifPresent(rel -> {
            rel.setIntimacyScore(rel.getIntimacyScore() + 20);
            rel.setLastInteractAt(LocalDateTime.now());
            relationRepository.save(rel);
        });
    }

    public List<GiftWallRecord> getGiftWall(Long merchantId) {
        return giftWallRepository.findByMerchantIdOrderByCreatedAtDesc(merchantId);
    }

    public List<CustomerDetailView> getLeaderboard(Long merchantId) {
        return getCustomers(merchantId);
    }
}
