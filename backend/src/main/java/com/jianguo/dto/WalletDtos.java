package com.jianguo.dto;

import lombok.Data;
import java.math.BigDecimal;

public class WalletDtos {

    @Data
    public static class RechargeRequest {
        private BigDecimal amount;
        private Integer coinsAwarded;
        private String paymentMethod; // WECHAT, ALIPAY
    }

    @Data
    public static class AddressRequest {
        private Long id;
        private String recipientName;
        private String phone;
        private String province;
        private String city;
        private String district;
        private String detailAddress;
        private Boolean isDefault;
    }
}
