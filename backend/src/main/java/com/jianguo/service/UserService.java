package com.jianguo.service;

import com.jianguo.dto.AuthDtos.UpdateProfileRequest;
import com.jianguo.dto.WalletDtos.AddressRequest;
import com.jianguo.entity.DailyTask;
import com.jianguo.entity.ShippingAddress;
import com.jianguo.entity.User;
import com.jianguo.repository.DailyTaskRepository;
import com.jianguo.repository.ShippingAddressRepository;
import com.jianguo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ShippingAddressRepository addressRepository;
    private final DailyTaskRepository taskRepository;

    public User getProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("用户不存在"));
    }

    @Transactional
    public User updateProfile(Long userId, UpdateProfileRequest req) {
        User user = getProfile(userId);
        if (req.getNickname() != null) user.setNickname(req.getNickname());
        if (req.getAvatarUrl() != null) user.setAvatarUrl(req.getAvatarUrl());
        if (req.getGender() != null) user.setGender(req.getGender());
        if (req.getBirthday() != null) user.setBirthday(req.getBirthday());
        if (req.getZodiacSign() != null) user.setZodiacSign(req.getZodiacSign());
        if (req.getBio() != null) user.setBio(req.getBio());
        return userRepository.save(user);
    }

    @Transactional
    public User upgradeVip(Long userId, int level) {
        User user = getProfile(userId);
        user.setVipLevel(level);
        user.setVipExpireAt(LocalDateTime.now().plusMonths(1));
        return userRepository.save(user);
    }

    public List<ShippingAddress> getAddresses(Long userId) {
        return addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
    }

    @Transactional
    public ShippingAddress saveAddress(Long userId, AddressRequest req) {
        ShippingAddress addr = req.getId() != null ?
                addressRepository.findById(req.getId()).orElse(new ShippingAddress()) :
                new ShippingAddress();

        addr.setUserId(userId);
        addr.setRecipientName(req.getRecipientName());
        addr.setPhone(req.getPhone());
        addr.setProvince(req.getProvince());
        addr.setCity(req.getCity());
        addr.setDistrict(req.getDistrict());
        addr.setDetailAddress(req.getDetailAddress());
        addr.setIsDefault(Boolean.TRUE.equals(req.getIsDefault()));

        if (Boolean.TRUE.equals(req.getIsDefault())) {
            List<ShippingAddress> list = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(userId);
            for (ShippingAddress a : list) {
                if (!a.getId().equals(addr.getId())) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
            }
        }
        return addressRepository.save(addr);
    }

    @Transactional
    public void deleteAddress(Long userId, Long addressId) {
        ShippingAddress addr = addressRepository.findById(addressId)
                .orElseThrow(() -> new IllegalArgumentException("地址不存在"));
        if (!addr.getUserId().equals(userId)) {
            throw new IllegalArgumentException("无权操作此地址");
        }
        addressRepository.delete(addr);
    }

    public List<DailyTask> getTasks(Long userId) {
        List<DailyTask> tasks = taskRepository.findByUserId(userId);
        if (tasks.isEmpty()) {
            initDefaultTasks(userId);
            tasks = taskRepository.findByUserId(userId);
        }
        return tasks;
    }

    @Transactional
    public void claimTaskReward(Long userId, Long taskId) {
        DailyTask task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("任务不存在"));
        if (Boolean.TRUE.equals(task.getIsClaimed())) {
            throw new IllegalArgumentException("该任务奖励已领取");
        }
        task.setIsClaimed(true);
        task.setIsCompleted(true);
        taskRepository.save(task);

        User user = getProfile(userId);
        user.setCoinBalance(user.getCoinBalance().add(task.getRewardCoins() != null ? task.getRewardCoins() : BigDecimal.TEN));
        userRepository.save(user);
    }

    private void initDefaultTasks(Long userId) {
        taskRepository.save(DailyTask.builder().userId(userId).taskCode("WATER_PLANT").title("每日浇水").description("为果园中的土地浇水 1 次").rewardCoins(new BigDecimal("20.00")).rewardType("COIN").isCompleted(true).isClaimed(false).build());
        taskRepository.save(DailyTask.builder().userId(userId).taskCode("DISINFEST_PEST").title("除虫卫士").description("使用驱虫喷雾清除害虫 1 次").rewardCoins(new BigDecimal("30.00")).rewardType("COIN").isCompleted(false).isClaimed(false).build());
        taskRepository.save(DailyTask.builder().userId(userId).taskCode("CHAT_FRIEND").title("社交问候").description("向好友发送 1 条问候消息").rewardCoins(new BigDecimal("15.00")).rewardType("COIN").isCompleted(true).isClaimed(false).build());
        taskRepository.save(DailyTask.builder().userId(userId).taskCode("HARVEST_FLOWER").title("丰收果实").description("累计采摘 1 束成熟玫瑰花").rewardCoins(new BigDecimal("50.00")).rewardType("COIN").isCompleted(false).isClaimed(false).build());
    }
}
