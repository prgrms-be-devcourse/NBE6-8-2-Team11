package com.back.domain.pet.repository;

import com.back.domain.pet.entity.PetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetStatusRepository extends JpaRepository<PetStatus, Long> {
}
