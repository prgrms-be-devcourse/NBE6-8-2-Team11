package com.back.domain.shelter.service;


import com.back.domain.shelter.dto.response.ShelterResponseDto;
import com.back.domain.shelter.entity.Shelter;
import com.back.domain.shelter.repository.ShelterRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class ShelterService {
    private final ShelterRepository shelterRepository;

    public ShelterResponseDto getShelterById(Long shelterId) {
        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));
        return ShelterResponseDto.from(shelter);
    }

    public Shelter findShelterById(Long shelterId) {
        return shelterRepository.findById(shelterId)
                .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));
    }
}
