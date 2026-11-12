package com.jianguo.dto;

import lombok.Data;
import java.math.BigDecimal;

public class ChatDtos {

    @Data
    public static class SendMessageRequest {
        private Long receiverId;
        private String messageType; // TEXT, VOICE, IMAGE, GIFT
        private String content;
        private Integer voiceDuration;
        private String giftName;
        private String giftIcon;
        private BigDecimal giftCost;
    }

    @Data
    public static class SendGiftRequest {
        private Long receiverId;
        private String giftName;
        private String giftIcon;
        private BigDecimal giftCost;
        private Integer giftCount;
    }
}
