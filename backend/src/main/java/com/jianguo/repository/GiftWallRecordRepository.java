package com.jianguo.repository;

import com.jianguo.entity.GiftWallRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftWallRecordRepository extends JpaRepository<GiftWallRecord, Long> {
    List<GiftWallRecord> findByMerchantIdOrderByCreatedAtDesc(Long merchantId);
    List<GiftWallRecord> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
