package com.jianguo.repository;

import com.jianguo.entity.UserBackpack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserBackpackRepository extends JpaRepository<UserBackpack, Long> {
    List<UserBackpack> findByUserId(Long userId);
    Optional<UserBackpack> findByUserIdAndItemId(Long userId, Long itemId);
}
