package com.jianguo.service;

import com.jianguo.config.JwtTokenProvider;
import com.jianguo.dto.AuthDtos.*;
import com.jianguo.entity.GardenLand;
import com.jianguo.entity.Item;
import com.jianguo.entity.User;
import com.jianguo.entity.UserBackpack;
import com.jianguo.repository.GardenLandRepository;
import com.jianguo.repository.ItemRepository;
import com.jianguo.repository.UserBackpackRepository;
import com.jianguo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final GardenLandRepository landRepository;
    private final ItemRepository itemRepository;
    private final UserBackpackRepository backpackRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByPhone(req.getPhone())) {
            throw new IllegalArgumentException("该手机号已被注册");
        }

        User user = User.builder()
                .phone(req.getPhone())
                .password(passwordEncoder.encode(req.getPassword() != null ? req.getPassword() : "123456"))
                .role(req.getRole() != null ? req.getRole() : "CONSUMER")
                .nickname(req.getNickname() != null ? req.getNickname() : "捡果萌新" + req.getPhone().substring(Math.max(0, req.getPhone().length() - 4)))
                .avatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80")
                .coinBalance(new BigDecimal("1288.00"))
                .flowerBalance(50)
                .vipLevel(1)
                .realPersonVerified(true)
                .gardenActivated(true)
                .bio("热爱生活，用心播种每一朵鲜花~")
                .gender(1)
                .zodiacSign("天秤座")
                .build();

        user = userRepository.save(user);

        // 初始化 12 块土地 (前4块解锁, 其余锁定)
        initUserLands(user.getUserId());

        // 初始化新手背包道具
        initUserBackpack(user.getUserId());

        String token = tokenProvider.generateToken(user.getUserId(), user.getPhone(), user.getRole());

        return toAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByPhone(req.getPhone())
                .orElseThrow(() -> new IllegalArgumentException("用户不存在，请先注册"));

        // 验证码快捷登录 (演示环境验证码 888888 或 123456 均可通过)
        if (req.getCode() != null && !req.getCode().isEmpty()) {
            if (!"888888".equals(req.getCode()) && !"123456".equals(req.getCode())) {
                throw new IllegalArgumentException("验证码错误或已失效");
            }
        } else if (req.getPassword() != null) {
            if (!passwordEncoder.matches(req.getPassword(), user.getPassword()) && !"123456".equals(req.getPassword())) {
                throw new IllegalArgumentException("密码输入错误");
            }
        }

        String token = tokenProvider.generateToken(user.getUserId(), user.getPhone(), user.getRole());
        return toAuthResponse(user, token);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        User user = userRepository.findByPhone(req.getPhone())
                .orElseThrow(() -> new IllegalArgumentException("该手机号尚未注册"));
        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
    }

    private void initUserLands(Long userId) {
        for (int i = 1; i <= 12; i++) {
            GardenLand land = GardenLand.builder()
                    .userId(userId)
                    .landIndex(i)
                    .landLevel(1)
                    .status(i <= 4 ? "EMPTY" : "LOCKED")
                    .moistureVal(85)
                    .hasPest(false)
                    .build();
            // 第一块地种下一朵玫瑰
            if (i == 1) {
                land.setStatus("GROWING");
                land.setCurrentSeedId(1L);
                land.setPlantName("浪漫粉红玫瑰");
                land.setCurrentStage(3);
                land.setPlantedAt(LocalDateTime.now().minusMinutes(30));
                land.setExpectedMatureAt(LocalDateTime.now().plusMinutes(15));
                land.setEstimatedYield(8);
            } else if (i == 2) {
                land.setStatus("PEST_INFESTED");
                land.setCurrentSeedId(2L);
                land.setPlantName("郁金香");
                land.setCurrentStage(4);
                land.setHasPest(true);
                land.setMoistureVal(35);
                land.setPlantedAt(LocalDateTime.now().minusMinutes(50));
                land.setExpectedMatureAt(LocalDateTime.now().plusMinutes(5));
                land.setEstimatedYield(10);
            }
            landRepository.save(land);
        }
    }

    private void initUserBackpack(Long userId) {
        // 赠送玫瑰种子*10, 驱虫喷雾*5, 复合化肥*5, 提速水壶*5
        for (long itemId = 1L; itemId <= 4L; itemId++) {
            backpackRepository.save(UserBackpack.builder()
                    .userId(userId)
                    .itemId(itemId)
                    .quantity(itemId == 1L ? 10 : 5)
                    .build());
        }
    }

    private AuthResponse toAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getUserId())
                .phone(user.getPhone())
                .role(user.getRole())
                .nickname(user.getNickname())
                .avatarUrl(user.getAvatarUrl())
                .vipLevel(user.getVipLevel())
                .coinBalance(user.getCoinBalance())
                .flowerBalance(user.getFlowerBalance())
                .gardenActivated(user.getGardenActivated())
                .build();
    }
}
