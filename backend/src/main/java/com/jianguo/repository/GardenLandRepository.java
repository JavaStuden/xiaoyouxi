package com.jianguo.repository;

import com.jianguo.entity.GardenLand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GardenLandRepository extends JpaRepository<GardenLand, Long> {
    List<GardenLand> findByUserIdOrderByLandIndexAsc(Long userId);
    Optional<GardenLand> findByUserIdAndLandIndex(Long userId, Integer landIndex);
}
