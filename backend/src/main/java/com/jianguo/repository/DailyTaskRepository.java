package com.jianguo.repository;

import com.jianguo.entity.DailyTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyTaskRepository extends JpaRepository<DailyTask, Long> {
    List<DailyTask> findByUserId(Long userId);
}
