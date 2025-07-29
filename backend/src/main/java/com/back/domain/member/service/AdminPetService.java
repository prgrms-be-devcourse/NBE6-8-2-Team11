//package com.back.domain.member.service;
//
//import com.back.domain.pet.dto.request.PetRequestDto;
//import com.back.domain.pet.dto.response.PetResponseDto;
//import com.back.domain.pet.entity.Pet;
//import com.back.domain.pet.exception.PetErrorCode;
//import com.back.domain.pet.exception.PetException;
//import com.back.domain.pet.repository.PetRepository;
//import com.back.domain.shelter.entity.Shelter;
//import com.back.domain.shelter.repository.ShelterRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@Transactional
//@RequiredArgsConstructor
//public class AdminPetService {
//
//    private final PetRepository petRepository;
//    private final ShelterRepository shelterRepository;
//
//    // 새로운 동물 등록
//    public PetResponseDto createPet(PetRequestDto requestDto) {
//        Shelter shelter = shelterRepository.findById(requestDto.getShelterId())
//                .orElseThrow(() -> new RuntimeException("해당 보호소를 찾을 수 없습니다."));
//
//        Pet pet = Pet.builder()
//                .name(requestDto.getName())
//                .species(requestDto.getSpecies())
//                .age(requestDto.getAge())
//                .gender(requestDto.getGender())
//                .description(requestDto.getDescription())
//                .imageUrl(requestDto.getImageUrl())
//                .shelter(shelter)
//                .build();
//
//        Pet savedPet = petRepository.save(pet);
//        return PetResponseDto.from(savedPet);
//    }
//
//
//    @Transactional(readOnly = true)
//    public List<PetResponseDto> getAllPets() {
//        return petRepository.findAll().stream()
//                .map(PetResponseDto::from)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional(readOnly = true)
//    public PetResponseDto getPetById(Long petId) {
//        Pet pet = petRepository.findById(petId)
//                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
//        return PetResponseDto.from(pet);
//    }
//
//    public PetResponseDto updatePet(Long petId, PetRequestDto requestDto) {
//        Pet pet = petRepository.findById(petId)
//                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
//
//        Shelter shelter = shelterRepository.findById(requestDto.getShelterId())
//                .orElseThrow(() -> new RuntimeException("해당 보호소를 찾을 수 없습니다."));
//        return PetResponseDto.from(petRepository.save(pet));
//    }
//
//    // 동물 정보 삭제
//    public void deletePet(Long petId) {
//        if (!petRepository.existsById(petId)) {
//            throw new PetException(PetErrorCode.PET_NOT_FOUND);
//        }
//        petRepository.deleteById(petId);
//    }
//}