package com.jianguo;

import com.jianguo.entity.*;
import com.jianguo.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@SpringBootApplication
public class JianGuoApplication {

    public static void main(String[] args) {
        SpringApplication.run(JianGuoApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            GardenLandRepository landRepository,
            ItemRepository itemRepository,
            UserBackpackRepository backpackRepository,
            MomentRepository momentRepository,
            MomentCommentRepository commentRepository,
            ChatMessageRepository chatRepository,
            VoiceRoomRepository voiceRoomRepository,
            MerchantCustomerRelationRepository relationRepository,
            GiftWallRecordRepository giftWallRepository,
            WalletTransactionRepository transactionRepository,
            ShippingAddressRepository addressRepository,
            DailyTaskRepository taskRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. 初始化商城基础道具与花种
            if (itemRepository.count() == 0) {
                Item roseSeed = itemRepository.save(Item.builder().name("浪漫红玫瑰种子").itemType("SEED").description("高雅纯洁，花语是热恋与长相厮守").price(new BigDecimal("10.00")).iconUrl("https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120").matureTimeSeconds(30).yieldCount(6).build());
                Item tulipSeed = itemRepository.save(Item.builder().name("金色郁金香种子").itemType("SEED").description("荷兰进口名贵花卉，尊贵与优雅的象征").price(new BigDecimal("25.00")).iconUrl("https://images.unsplash.com/photo-1520763185298-1b434c919102?w=120").matureTimeSeconds(60).yieldCount(10).build());
                Item spray = itemRepository.save(Item.builder().name("强效除虫药剂").itemType("PEST_SPRAY").description("特效生物喷剂，一键灭除果园全部害虫").price(new BigDecimal("15.00")).iconUrl("https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=120").build());
                Item water = itemRepository.save(Item.builder().name("充盈补水壶").itemType("WATER_CAN").description("快速为干涸土地浇水，维持水源充盈").price(new BigDecimal("8.00")).iconUrl("https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=120").build());
                Item fertilizer = itemRepository.save(Item.builder().name("高效有机催熟肥").itemType("FERTILIZER").description("显著提升土壤肥力，缩短50%花卉绽放时间").price(new BigDecimal("30.00")).iconUrl("https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=120").build());
                Item bouquet = itemRepository.save(Item.builder().name("盛宴99朵臻爱玫瑰花束").itemType("BOUQUET").description("手工定制礼盒花束，可赠予好友或到店兑换实物").price(new BigDecimal("199.00")).iconUrl("https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=120").build());
            }

            // 2. 初始化核心测试账号：客户端用户与商户端用户
            if (userRepository.count() == 0) {
                // 客户端用户
                User consumer = User.builder()
                        .phone("13800138000")
                        .password(passwordEncoder.encode("123456"))
                        .role("CONSUMER")
                        .nickname("林小果")
                        .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80")
                        .gender(2) // 女
                        .birthday(LocalDate.of(2000, 10, 15))
                        .zodiacSign("天秤座")
                        .bio("在捡果花园里，静候每一朵鲜花绽放 🌸")
                        .realPersonVerified(true)
                        .vipLevel(2) // SVIP
                        .vipExpireAt(LocalDateTime.now().plusMonths(6))
                        .coinBalance(new BigDecimal("3680.00"))
                        .flowerBalance(128)
                        .gardenActivated(true)
                        .build();
                consumer = userRepository.save(consumer);

                // 商户端用户
                User merchant = User.builder()
                        .phone("13900139000")
                        .password(passwordEncoder.encode("123456"))
                        .role("MERCHANT")
                        .nickname("花之恋花艺旗舰店")
                        .avatarUrl("https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=200&auto=format&fit=crop&q=80")
                        .gender(1)
                        .birthday(LocalDate.of(1995, 5, 20))
                        .zodiacSign("金牛座")
                        .bio("专注高端鲜花定制与同城极速配送，商户认证专属果园。")
                        .realPersonVerified(true)
                        .vipLevel(3) // 黑金会员
                        .vipExpireAt(LocalDateTime.now().plusYears(1))
                        .coinBalance(new BigDecimal("99999.00"))
                        .flowerBalance(9999)
                        .gardenActivated(true)
                        .build();
                merchant = userRepository.save(merchant);

                // 3. 为客户端用户初始化土地 (包含 生长中、生虫突发、水分流失、成熟可摘等多种原型状态)
                for (int i = 1; i <= 12; i++) {
                    GardenLand land = GardenLand.builder()
                            .userId(consumer.getUserId())
                            .landIndex(i)
                            .landLevel(i <= 2 ? 2 : 1)
                            .status(i <= 6 ? "EMPTY" : "LOCKED")
                            .moistureVal(85)
                            .hasPest(false)
                            .build();

                    if (i == 1) {
                        land.setStatus("MATURE");
                        land.setCurrentSeedId(1L);
                        land.setPlantName("浪漫红玫瑰");
                        land.setCurrentStage(5); // 成熟期
                        land.setMoistureVal(95);
                        land.setPlantedAt(LocalDateTime.now().minusMinutes(40));
                        land.setExpectedMatureAt(LocalDateTime.now().minusMinutes(5));
                        land.setEstimatedYield(8);
                    } else if (i == 2) {
                        land.setStatus("PEST_INFESTED");
                        land.setCurrentSeedId(2L);
                        land.setPlantName("金色郁金香");
                        land.setCurrentStage(4); // 开花期遇虫
                        land.setHasPest(true);
                        land.setMoistureVal(30); // 水分不足警示
                        land.setPlantedAt(LocalDateTime.now().minusMinutes(25));
                        land.setExpectedMatureAt(LocalDateTime.now().plusMinutes(10));
                        land.setEstimatedYield(10);
                    } else if (i == 3) {
                        land.setStatus("GROWING");
                        land.setCurrentSeedId(1L);
                        land.setPlantName("香槟玫瑰");
                        land.setCurrentStage(2); // 抽枝期
                        land.setMoistureVal(55); // 水源流失中
                        land.setPlantedAt(LocalDateTime.now().minusMinutes(10));
                        land.setExpectedMatureAt(LocalDateTime.now().plusMinutes(20));
                        land.setEstimatedYield(6);
                    }
                    landRepository.save(land);
                }

                // 4. 初始化背包
                backpackRepository.save(UserBackpack.builder().userId(consumer.getUserId()).itemId(1L).quantity(15).build());
                backpackRepository.save(UserBackpack.builder().userId(consumer.getUserId()).itemId(2L).quantity(8).build());
                backpackRepository.save(UserBackpack.builder().userId(consumer.getUserId()).itemId(3L).quantity(5).build());
                backpackRepository.save(UserBackpack.builder().userId(consumer.getUserId()).itemId(4L).quantity(6).build());
                backpackRepository.save(UserBackpack.builder().userId(consumer.getUserId()).itemId(6L).quantity(2).build());

                // 5. 初始化邂逅广场动态
                Moment m1 = momentRepository.save(Moment.builder()
                        .userId(consumer.getUserId())
                        .authorName(consumer.getNickname())
                        .authorAvatar(consumer.getAvatarUrl())
                        .authorVipLevel(consumer.getVipLevel())
                        .authorRealVerified(true)
                        .content("今天果园里的第一束粉色玫瑰盛放了！散发着淡淡的清香，想要送给同城有缘的小伙伴~ 🌷✨")
                        .mediaUrls("[\"https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800\", \"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=800\"]")
                        .locationName("静安大悦城·空中花园")
                        .likeCount(36)
                        .commentCount(3)
                        .createdAt(LocalDateTime.now().minusHours(2))
                        .build());

                commentRepository.save(MomentComment.builder().momentId(m1.getMomentId()).userId(merchant.getUserId()).userName(merchant.getNickname()).userAvatar(merchant.getAvatarUrl()).content("花色饱满纯正，欢迎来我们门店兑换精美定制花瓶！").build());
                commentRepository.save(MomentComment.builder().momentId(m1.getMomentId()).userId(consumer.getUserId()).userName("江畔晨星").userAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100").content("太好看了吧，怎么种出的5级粉玫瑰呀？").build());

                // 6. 初始化暗色语音聊天室
                voiceRoomRepository.save(VoiceRoom.builder()
                        .title("🎵 心动电台与花园慢聊房 (8麦畅聊)")
                        .hostId(consumer.getUserId())
                        .hostName("林小果")
                        .hostAvatar(consumer.getAvatarUrl())
                        .onlineCount(86)
                        .announcement("欢迎来到捡果官方语音房！今晚分享大家的花园收成与浪漫日常，上麦请戴耳机。")
                        .activeSeatsJson("[{\"seat\":1,\"name\":\"林小果\",\"speaking\":true,\"avatar\":\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100\"},{\"seat\":2,\"name\":\"花店老板\",\"speaking\":false,\"avatar\":\"https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100\"}]")
                        .build());

                // 7. 初始化聊天会话与消息
                chatRepository.save(ChatMessage.builder().senderId(merchant.getUserId()).receiverId(consumer.getUserId()).messageType("TEXT").content("您好！欢迎关注花之恋旗舰店，您的专属种植地块已升级！").isRead(true).createdAt(LocalDateTime.now().minusMinutes(50)).build());
                chatRepository.save(ChatMessage.builder().senderId(consumer.getUserId()).receiverId(merchant.getUserId()).messageType("TEXT").content("太棒了，请问采摘后的花束可以直接去店里打包吗？").isRead(true).createdAt(LocalDateTime.now().minusMinutes(45)).build());
                chatRepository.save(ChatMessage.builder().senderId(merchant.getUserId()).receiverId(consumer.getUserId()).messageType("VOICE").content("[语音留言 8\"]").voiceDuration(8).isRead(true).createdAt(LocalDateTime.now().minusMinutes(30)).build());
                chatRepository.save(ChatMessage.builder().senderId(consumer.getUserId()).receiverId(merchant.getUserId()).messageType("GIFT").content("赠送了 [红玫瑰] x1").giftName("红玫瑰").giftIcon("🌹").giftCost(new BigDecimal("10.00")).isRead(true).createdAt(LocalDateTime.now().minusMinutes(10)).build());

                // 8. 商户端私域关系与礼物墙
                relationRepository.save(MerchantCustomerRelation.builder()
                        .merchantId(merchant.getUserId())
                        .customerId(consumer.getUserId())
                        .status("ACCEPTED")
                        .customRemark("高频互动·林小姐")
                        .customerTags("[\"高净值\", \"爱玫瑰\", \"活跃用户\"]")
                        .intimacyScore(380)
                        .lastInteractAt(LocalDateTime.now())
                        .build());

                giftWallRepository.save(GiftWallRecord.builder()
                        .merchantId(merchant.getUserId())
                        .customerId(consumer.getUserId())
                        .customerName(consumer.getNickname())
                        .customerAvatar(consumer.getAvatarUrl())
                        .giftName("璀璨玫瑰皇冠")
                        .giftIcon("👑")
                        .giftCount(1)
                        .amount(new BigDecimal("98.00"))
                        .direction("CUSTOMER_TO_MERCHANT")
                        .createdAt(LocalDateTime.now().minusDays(1))
                        .build());

                // 9. 账单明细
                transactionRepository.save(WalletTransaction.builder().userId(consumer.getUserId()).type("RECHARGE").amount(new BigDecimal("98.00")).balanceAfter(new BigDecimal("3680.00")).description("微信充值 980 金币 (赠送150金币)").orderNo("ORD-20261112-9801").build());
                transactionRepository.save(WalletTransaction.builder().userId(consumer.getUserId()).type("CONSUME").amount(new BigDecimal("30.00")).balanceAfter(new BigDecimal("3582.00")).description("购买高效有机催熟肥 x1").orderNo("ORD-20261112-3002").build());

                // 10. 收货地址
                addressRepository.save(ShippingAddress.builder().userId(consumer.getUserId()).recipientName("林小果").phone("13800138000").province("上海市").city("上海市").district("静安区").detailAddress("南京西路1601号越洋广场A座18层").isDefault(true).build());
                addressRepository.save(ShippingAddress.builder().userId(consumer.getUserId()).recipientName("林女士").phone("13800138000").province("浙江省").city("杭州市").district("西湖区").detailAddress("文三路东方通信大厦3号楼").isDefault(false).build());

                // 11. 任务列表
                taskRepository.save(DailyTask.builder().userId(consumer.getUserId()).taskCode("WATER_PLANT").title("每日果园浇水").description("为果园中的土地浇水 1 次，维持土地充盈").rewardCoins(new BigDecimal("20.00")).rewardType("COIN").isCompleted(true).isClaimed(false).build());
                taskRepository.save(DailyTask.builder().userId(consumer.getUserId()).taskCode("DISINFEST_PEST").title("除虫急先锋").description("使用驱虫喷雾消灭 1 次害虫").rewardCoins(new BigDecimal("30.00")).rewardType("COIN").isCompleted(false).isClaimed(false).build());
                taskRepository.save(DailyTask.builder().userId(consumer.getUserId()).taskCode("CHAT_FRIEND").title("好友互动问候").description("向好友或商户发送 1 条私信").rewardCoins(new BigDecimal("15.00")).rewardType("COIN").isCompleted(true).isClaimed(true).build());
            }
        };
    }
}
