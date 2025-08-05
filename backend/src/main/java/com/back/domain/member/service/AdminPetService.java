package com.back.domain.member.service;

import com.back.domain.member.entity.Member;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.pet.dto.request.PetCreateRequestDto;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.dto.response.PetInfoResponseDto;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.entity.PetStatus;
import com.back.domain.pet.enums.PetStatusType;
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

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminPetService {

    private final PetRepository petRepository;
    private final ShelterRepository shelterRepository;
    private final MemberRepository memberRepository;

    // 새로운 동물 등록
    public PetInfoResponseDto createPet(PetCreateRequestDto requestDto, String adminEmail) {
        // 관리자 이메일로 Member 조회
        Member admin = memberRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new PetException(PetErrorCode.MEMBER_NOT_FOUND));

        // 보호소 null 값 허용
        Shelter shelter = null;
        if (requestDto.getShelterName() != null && !requestDto.getShelterName().isBlank()) {
            shelter = shelterRepository.findByName(requestDto.getShelterName())
                    .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));
        }

        Pet pet = Pet.builder()
                .name(requestDto.getName())
                .species(requestDto.getSpecies())
                .age(requestDto.getAge())
                .gender(requestDto.getGender())
                .description(requestDto.getDescription())
                .imageUrl(requestDto.getImageUrl())
                .shelter(shelter)
                .member(admin) // 관리자 멤버로 추가
                .build();

        // PetStatus 리스트를 생성하고 설정하는 로직 추가
        List<PetStatus> statuses = new ArrayList<>();
        if (requestDto.getStatuses() != null) {
            statuses = requestDto.getStatuses().stream()
                    .map(status -> PetStatus.builder()
                            .status(PetStatusType.valueOf(status))
                            .pet(pet)
                            .build())
                    .collect(Collectors.toList());
        }
        pet.setPetStatuses(statuses); // 생성된 상태 리스트를 펫 객체에 설정

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

        // 필요없을 시 주석 처리 가능
        Shelter shelter = null;
        if (requestDto.getShelterName() != null && !requestDto.getShelterName().isBlank()) {
            shelter = shelterRepository.findByName(requestDto.getShelterName())
                    .orElseThrow(() -> new CustomException(ErrorCode.SHELTER_NOT_FOUND));
        }

        pet.updatePet(requestDto);

        // [수정된 부분] 기존 컬렉션을 clear하고 새로운 요소를 addAll 하는 방식으로 변경
        pet.getPetStatuses().clear(); // 1. 기존 리스트의 내용을 모두 지움

        if (requestDto.getStatuses() != null && !requestDto.getStatuses().isEmpty()) {
            List<PetStatus> newStatuses = requestDto.getStatuses().stream()
                    .map(status -> PetStatus.builder()
                            .status(PetStatusType.valueOf(status))
                            .pet(pet)
                            .build())
                    .collect(Collectors.toList());
            pet.getPetStatuses().addAll(newStatuses); // 2. 기존 리스트에 새로운 요소들을 추가
        }

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