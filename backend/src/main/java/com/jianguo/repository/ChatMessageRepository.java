package com.jianguo.repository;

import com.jianguo.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT m FROM ChatMessage m WHERE (m.senderId = :u1 AND m.receiverId = :u2) OR (m.senderId = :u2 AND m.receiverId = :u1) ORDER BY m.createdAt ASC")
    List<ChatMessage> findChatHistory(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT m FROM ChatMessage m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.createdAt DESC")
    List<ChatMessage> findUserAllMessages(@Param("userId") Long userId);
}
