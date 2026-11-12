package com.jianguo.repository;

import com.jianguo.entity.VoiceRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VoiceRoomRepository extends JpaRepository<VoiceRoom, Long> {
    List<VoiceRoom> findAllByOrderByOnlineCountDesc();
}
