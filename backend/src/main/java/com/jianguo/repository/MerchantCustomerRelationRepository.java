package com.jianguo.repository;

import com.jianguo.entity.MerchantCustomerRelation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantCustomerRelationRepository extends JpaRepository<MerchantCustomerRelation, Long> {
    List<MerchantCustomerRelation> findByMerchantIdOrderByIntimacyScoreDesc(Long merchantId);
    Optional<MerchantCustomerRelation> findByMerchantIdAndCustomerId(Long merchantId, Long customerId);
    List<MerchantCustomerRelation> findByCustomerId(Long customerId);
}
