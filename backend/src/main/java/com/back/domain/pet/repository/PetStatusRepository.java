package com.back.domain.pet.repository;

import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.entity.PetStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetStatusRepository extends JpaRepository<PetStatus, Long> {
    List<PetStatus> findByPet(Pet testPet);
}
