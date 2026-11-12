package com.jianguo.service;

import com.jianguo.dto.GardenDtos.*;
import com.jianguo.entity.GardenLand;
import com.jianguo.entity.Item;
import com.jianguo.entity.User;
import com.jianguo.entity.UserBackpack;
import com.jianguo.repository.GardenLandRepository;
import com.jianguo.repository.ItemRepository;
import com.jianguo.repository.UserBackpackRepository;
import com.jianguo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GardenService {

    private final GardenLandRepository landRepository;
    private final ItemRepository itemRepository;
    private final UserBackpackRepository backpackRepository;
    private final UserRepository userRepository;

    public List<GardenLand> getMyLands(Long userId) {
        List<GardenLand> lands = landRepository.findByUserIdOrderByLandIndexAsc(userId);
        if (lands.isEmpty()) {
            // 自动补齐土地
            for (int i = 1; i <= 12; i++) {
                GardenLand land = GardenLand.builder()
                        .userId(userId)
                        .landIndex(i)
                        .landLevel(1)
                        .status(i <= 4 ? "EMPTY" : "LOCKED")
                        .moistureVal(80)
                        .hasPest(false)
                        .build();
                landRepository.save(land);
            }
            lands = landRepository.findByUserIdOrderByLandIndexAsc(userId);
        }

        // 刷新植物生长状态与偶发生长事件
        LocalDateTime now = LocalDateTime.now();
        for (GardenLand land : lands) {
            if ("GROWING".equals(land.getStatus()) && land.getExpectedMatureAt() != null) {
                if (now.isAfter(land.getExpectedMatureAt())) {
                    land.setStatus("MATURE");
                    land.setCurrentStage(5);
                    landRepository.save(land);
                }
            }
        }
        return lands;
    }

    @Transactional
    public GardenLand plantSeed(Long userId, PlantRequest req) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, req.getLandIndex())
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if ("LOCKED".equals(land.getStatus())) {
            throw new IllegalArgumentException("该地块尚未解锁，请先开垦购买");
        }
        if (!"EMPTY".equals(land.getStatus())) {
            throw new IllegalArgumentException("当前土地已有植物，请先采摘或清理");
        }

        // 校验并扣除背包中的种子
        UserBackpack backpack = backpackRepository.findByUserIdAndItemId(userId, req.getSeedId())
                .orElseThrow(() -> new IllegalArgumentException("背包中没有该植物种子"));

        if (backpack.getQuantity() <= 0) {
            throw new IllegalArgumentException("种子数量不足");
        }
        backpack.setQuantity(backpack.getQuantity() - 1);
        backpackRepository.save(backpack);

        Item seed = itemRepository.findById(req.getSeedId())
                .orElseThrow(() -> new IllegalArgumentException("种子数据异常"));

        land.setStatus("GROWING");
        land.setCurrentSeedId(seed.getItemId());
        land.setPlantName(seed.getName());
        land.setPlantedAt(LocalDateTime.now());
        land.setCurrentStage(1); // 幼苗期
        land.setMoistureVal(90); // 播种浇水充盈
        land.setHasPest(false);
        int growSec = seed.getMatureTimeSeconds() != null ? seed.getMatureTimeSeconds() : 60;
        land.setExpectedMatureAt(LocalDateTime.now().plusSeconds(growSec));
        land.setEstimatedYield(seed.getYieldCount() != null ? seed.getYieldCount() : 5);

        return landRepository.save(land);
    }

    @Transactional
    public GardenLand water(Long userId, WaterRequest req) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, req.getLandIndex())
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if ("LOCKED".equals(land.getStatus()) || "EMPTY".equals(land.getStatus())) {
            throw new IllegalArgumentException("当前地块无需浇水");
        }

        land.setMoistureVal(100);
        return landRepository.save(land);
    }

    @Transactional
    public GardenLand disinfest(Long userId, DisinfestRequest req) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, req.getLandIndex())
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if (!land.getHasPest() && !"PEST_INFESTED".equals(land.getStatus())) {
            throw new IllegalArgumentException("该土地目前生机盎然，没有害虫侵扰");
        }

        // 消耗背包驱虫喷雾
        UserBackpack backpack = backpackRepository.findByUserIdAndItemId(userId, 2L) // 2L 为驱虫喷雾
                .orElse(null);
        if (backpack != null && backpack.getQuantity() > 0) {
            backpack.setQuantity(backpack.getQuantity() - 1);
            backpackRepository.save(backpack);
        }

        land.setHasPest(false);
        land.setStatus("GROWING");
        return landRepository.save(land);
    }

    @Transactional
    public int harvest(Long userId, Integer landIndex) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, landIndex)
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if (!"MATURE".equals(land.getStatus())) {
            throw new IllegalArgumentException("作物尚未完全成熟，请耐心等待绽放");
        }

        int yield = land.getEstimatedYield() != null ? land.getEstimatedYield() : 5;

        // 增加用户鲜花资产
        User user = userRepository.findById(userId).orElseThrow();
        user.setFlowerBalance(user.getFlowerBalance() + yield);
        userRepository.save(user);

        // 重置地块为空地
        land.setStatus("EMPTY");
        land.setCurrentSeedId(null);
        land.setPlantName(null);
        land.setCurrentStage(0);
        land.setHasPest(false);
        land.setExpectedMatureAt(null);
        landRepository.save(land);

        return yield;
    }

    @Transactional
    public GardenLand upgradeLand(Long userId, UpgradeLandRequest req) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, req.getLandIndex())
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if ("LOCKED".equals(land.getStatus())) {
            throw new IllegalArgumentException("请先解锁开垦此地块");
        }
        if (land.getLandLevel() >= 3) {
            throw new IllegalArgumentException("地块肥沃度已升至最高阶 (金土地)");
        }

        User user = userRepository.findById(userId).orElseThrow();
        BigDecimal cost = land.getLandLevel() == 1 ? new BigDecimal("200.00") : new BigDecimal("500.00");
        if (user.getCoinBalance().compareTo(cost) < 0) {
            throw new IllegalArgumentException("金币余额不足，升级土地需消耗 " + cost + " 金币");
        }

        user.setCoinBalance(user.getCoinBalance().subtract(cost));
        userRepository.save(user);

        land.setLandLevel(land.getLandLevel() + 1);
        return landRepository.save(land);
    }

    @Transactional
    public GardenLand purchaseLand(Long userId, PurchaseLandRequest req) {
        GardenLand land = landRepository.findByUserIdAndLandIndex(userId, req.getLandIndex())
                .orElseThrow(() -> new IllegalArgumentException("地块不存在"));

        if (!"LOCKED".equals(land.getStatus())) {
            throw new IllegalArgumentException("该地块已经处于开垦可用状态");
        }

        User user = userRepository.findById(userId).orElseThrow();
        BigDecimal cost = new BigDecimal("300.00");
        if (user.getCoinBalance().compareTo(cost) < 0) {
            throw new IllegalArgumentException("金币不足，开垦新地块需消耗 " + cost + " 金币");
        }

        user.setCoinBalance(user.getCoinBalance().subtract(cost));
        userRepository.save(user);

        land.setStatus("EMPTY");
        land.setMoistureVal(80);
        land.setLandLevel(1);
        return landRepository.save(land);
    }
}
