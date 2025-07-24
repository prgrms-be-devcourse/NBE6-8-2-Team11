package com.back.domain.care.repository;

import com.back.domain.care.entity.Care;
import com.back.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface CareRepository extends JpaRepository<Care, Long> {

    List<Care> findByMemberOrderByCreatedAtDesc(Member member);

    Optional<Care> findByIdAndMember(Long id, Member member);

    List<Care> findByMember(Member member);

    List<Care> findByPet_MemberOrderByCreatedAtDesc(Member member);
} 