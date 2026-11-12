package com.jianguo.service;

import com.jianguo.entity.Item;
import com.jianguo.entity.User;
import com.jianguo.entity.UserBackpack;
import com.jianguo.repository.ItemRepository;
import com.jianguo.repository.UserBackpackRepository;
import com.jianguo.repository.UserRepository;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BackpackService {

    private final UserBackpackRepository backpackRepository;
    private final ItemRepository itemRepository;
    private final UserRepository userRepository;

    @Data
    @Builder
    public static class BackpackItemView {
        private Long id;
        private Long itemId;
        private String name;
        private String itemType;
        private String description;
        private BigDecimal price;
        private String iconUrl;
        private Integer quantity;
        private Integer matureTimeSeconds;
    }

    public List<BackpackItemView> getUserBackpack(Long userId, String type) {
        List<UserBackpack> backpacks = backpackRepository.findByUserId(userId);
        Map<Long, Item> itemMap = itemRepository.findAll().stream()
                .collect(Collectors.toMap(Item::getItemId, Function.identity()));

        List<BackpackItemView> result = new ArrayList<>();
        for (UserBackpack ub : backpacks) {
            Item item = itemMap.get(ub.getItemId());
            if (item != null) {
                if (type == null || type.isEmpty() || type.equalsIgnoreCase(item.getItemType())) {
                    result.add(BackpackItemView.builder()
                            .id(ub.getId())
                            .itemId(item.getItemId())
                            .name(item.getName())
                            .itemType(item.getItemType())
                            .description(item.getDescription())
                            .price(item.getPrice())
                            .iconUrl(item.getIconUrl())
                            .quantity(ub.getQuantity())
                            .matureTimeSeconds(item.getMatureTimeSeconds())
                            .build());
                }
            }
        }
        return result;
    }

    @Transactional
    public void buyItem(Long userId, Long itemId, int quantity) {
        if (quantity <= 0) quantity = 1;
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("道具不存在"));

        BigDecimal totalCost = item.getPrice().multiply(new BigDecimal(quantity));
        User user = userRepository.findById(userId).orElseThrow();

        if (user.getCoinBalance().compareTo(totalCost) < 0) {
            throw new IllegalArgumentException("金币余额不足，购买需要 " + totalCost + " 金币");
        }

        user.setCoinBalance(user.getCoinBalance().subtract(totalCost));
        userRepository.save(user);

        UserBackpack backpack = backpackRepository.findByUserIdAndItemId(userId, itemId)
                .orElse(UserBackpack.builder()
                        .userId(userId)
                        .itemId(itemId)
                        .quantity(0)
                        .build());
        backpack.setQuantity(backpack.getQuantity() + quantity);
        backpackRepository.save(backpack);
    }
}
