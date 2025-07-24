package com.back.domain.adoption.repository;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

public interface AdoptionRepository extends JpaRepository<Adoption, Long> {

    List<Adoption> findByMemberOrderByCreatedAtDesc(Member member);

    Optional<Adoption> findByIdAndMember(Long id, Member member);

    List<Adoption> findByMember(Member member);
} 