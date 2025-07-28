package com.back.domain.chat.repository;

import com.back.domain.chat.entity.ChatRoom;
import com.back.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    
    @Query("SELECT cr FROM ChatRoom cr WHERE (cr.firstMember = :member1 AND cr.secondMember = :member2) OR (cr.firstMember = :member2 AND cr.secondMember = :member1)")
    Optional<ChatRoom> findByMembers(@Param("member1") Member member1, @Param("member2") Member member2);
    
    @Query("SELECT cr FROM ChatRoom cr WHERE cr.firstMember = :member OR cr.secondMember = :member")
    List<ChatRoom> findByMember(@Param("member") Member member);
} 