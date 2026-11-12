package com.jianguo.service;

import com.jianguo.dto.WalletDtos.RechargeRequest;
import com.jianguo.entity.User;
import com.jianguo.entity.WalletTransaction;
import com.jianguo.repository.UserRepository;
import com.jianguo.repository.WalletTransactionRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final UserRepository userRepository;
    private final WalletTransactionRepository transactionRepository;

    @Data
    @Builder
    public static class RechargePackage {
        private String id;
        private BigDecimal price;
        private Integer baseCoins;
        private Integer bonusCoins;
        private String tag;
    }

    public List<RechargePackage> getRechargePackages() {
        return Arrays.asList(
                RechargePackage.builder().id("pkg_6").price(new BigDecimal("6.00")).baseCoins(60).bonusCoins(0).tag("").build(),
                RechargePackage.builder().id("pkg_30").price(new BigDecimal("30.00")).baseCoins(300).bonusCoins(30).tag("热卖推荐").build(),
                RechargePackage.builder().id("pkg_98").price(new BigDecimal("98.00")).baseCoins(980).bonusCoins(150).tag("超值礼包").build(),
                RechargePackage.builder().id("pkg_298").price(new BigDecimal("298.00")).baseCoins(2980).bonusCoins(600).tag("尊贵尊享").build(),
                RechargePackage.builder().id("pkg_648").price(new BigDecimal("648.00")).baseCoins(6480).bonusCoins(1680).tag("黑金特惠").build()
        );
    }

    @Transactional
    public User executeRecharge(Long userId, RechargeRequest req) {
        User user = userRepository.findById(userId).orElseThrow();
        int coins = req.getCoinsAwarded() != null ? req.getCoinsAwarded() : req.getAmount().multiply(new BigDecimal(10)).intValue();

        user.setCoinBalance(user.getCoinBalance().add(new BigDecimal(coins)));
        userRepository.save(user);

        WalletTransaction tx = WalletTransaction.builder()
                .userId(userId)
                .type("RECHARGE")
                .amount(req.getAmount())
                .balanceAfter(user.getCoinBalance())
                .description("钱包在线充值 " + coins + " 金币")
                .orderNo("ORD-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase())
                .build();
        transactionRepository.save(tx);

        return user;
    }

    public List<WalletTransaction> getTransactions(Long userId, String type) {
        if (type != null && !type.isEmpty() && !"ALL".equalsIgnoreCase(type)) {
            return transactionRepository.findByUserIdAndTypeOrderByCreatedAtDesc(userId, type.toUpperCase());
        }
        return transactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
