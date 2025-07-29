package com.back.domain.member.service;

import com.back.domain.pet.dto.request.PetCreateRequestDto;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.exception.PetErrorCode;
import com.back.domain.pet.exception.PetException;
import com.back.domain.pet.repository.PetRepository;
import com.back.domain.shelter.entity.Shelter;
import com.back.domain.shelter.repository.ShelterRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminPetService {

    private final PetRepository petRepository;
    private final ShelterRepository shelterRepository;

    // 새로운 동물 등록
    public PetInfoResponseDto createPet(PetCreateRequestDto requestDto) {
        Shelter shelter = shelterRepository.findByName(requestDto.getShelterName())
                .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));

        Pet pet = Pet.builder()
                .name(requestDto.getName())
                .species(requestDto.getSpecies())
                .age(requestDto.getAge())
                .gender(requestDto.getGender())
                .description(requestDto.getDescription())
                .imageUrl(requestDto.getImageUrl())
                .shelter(shelter)
                .build();

        Pet savedPet = petRepository.save(pet);
        return PetInfoResponseDto.from(savedPet);
    }

    // 모든 동물 조회
    @Transactional(readOnly = true)
    public List<PetInfoResponseDto> getAllPets() {
        return petRepository.findAll().stream()
                .map(PetInfoResponseDto::from)
                .collect(Collectors.toList());
    }

    // 특정 동물 조회
    @Transactional(readOnly = true)
    public PetInfoResponseDto getPetById(Long petId) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        return PetInfoResponseDto.from(pet);
    }

    // 동물 정보 수정
    public PetInfoResponseDto updatePet(Long petId, PetUpdateRequestDto requestDto) {
        Pet pet = petRepository.findById(petId)
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        Shelter shelter = shelterRepository.findByName(requestDto.getShelterName())
                .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));

        pet.updatePet(requestDto);

        return PetInfoResponseDto.from(pet);
    }

    // 동물 정보 삭제
    public void deletePet(Long petId) {
        if (!petRepository.existsById(petId)) {
            throw new PetException(PetErrorCode.PET_NOT_FOUND);
        }
        petRepository.deleteById(petId);
    }
}