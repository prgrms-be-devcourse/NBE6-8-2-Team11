package com.back.domain.shelter.repository;

import com.back.domain.shelter.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    Optional<Shelter> findByName(String name);
}
