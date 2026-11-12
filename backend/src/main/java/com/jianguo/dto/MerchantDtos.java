package com.jianguo.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

public class MerchantDtos {

    @Data
    public static class InviteCustomerRequest {
        private String customerPhone;
    }

    @Data
    public static class UpdateCustomerRemarkRequest {
        private Long customerId;
        private String customRemark;
        private List<String> customerTags;
    }

    @Data
    public static class MerchantGiftRewardRequest {
        private Long customerId;
        private String giftName;
        private String giftIcon;
        private BigDecimal amount;
    }
}
