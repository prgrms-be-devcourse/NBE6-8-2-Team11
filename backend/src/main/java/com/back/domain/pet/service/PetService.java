package com.back.domain.pet.service;

import com.back.domain.member.entity.Member;
import com.back.domain.member.enums.UserRole;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class PetService {
     private final PetRepository petRepository;
     private final MemberRepository memberRepository;
     private final ShelterRepository shelterRepository;

     //펫 등록
     public PetInfoResponseDto createPet(PetCreateRequestDto dto, String userEmail) {
          Member member = memberRepository.findByEmail(userEmail)
                  .orElseThrow(() -> new PetException(PetErrorCode.MEMBER_NOT_FOUND));

          Shelter shelter;
          if (dto.getShelterName() != null && !dto.getShelterName().isBlank()) {
               shelter = shelterRepository.findByName(dto.getShelterName())
                       .orElseThrow(() -> new PetException(PetErrorCode.SHELTER_NOT_FOUND));
          } else {
               shelter = null; // 보호소 미지정 시 null 처리
          }

          Pet pet = Pet.builder()
                  .name(dto.getName())
                  .species(dto.getSpecies())
                  .age(dto.getAge() != null ? dto.getAge() : 0)
                  .gender(dto.getGender())
                  .description(dto.getDescription())
                  .imageUrl(dto.getImageUrl())
                  .shelter(shelter)
                  .member(member)
                  .build();

          List<PetStatus> statuses = dto.getStatuses().stream()
                  .map(status -> PetStatus.builder()
                          .status(PetStatusType.valueOf(status))
                          .pet(pet)
                          .build())
                  .collect(Collectors.toList());

          pet.setPetStatuses(statuses);


          petRepository.save(pet);

          return PetInfoResponseDto.from(pet);
     }

     //펫 삭제
     public void deletePet(Long petId, String userEmail) {
          // 요청한 회원 정보 조회
          Member member = memberRepository.findByEmail(userEmail)
                  .orElseThrow(() -> new PetException(PetErrorCode.MEMBER_NOT_FOUND));

          // 삭제 대상 반려동물 조회
          Pet pet = petRepository.findById(petId)
                  .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

          // 관리자거나, 반려동물 소유주일 때만 삭제 가능
          if (!member.getRole().equals(UserRole.ADMIN)
                  && (pet.getMember() == null || !pet.getMember().getId().equals(member.getId()))) {
               throw new PetException(PetErrorCode.MEMBER_FORBIDDEN);
          }

          // 삭제 진행
          petRepository.delete(pet);
     }

     public PetInfoResponseDto updatePet(Long petId, String userEmail, PetUpdateRequestDto requestDto) {
          // 유저 검증
          Member member = memberRepository.findByEmail(userEmail)
                  .orElseThrow(() -> new PetException(PetErrorCode.MEMBER_NOT_FOUND));

          // 펫 존재 확인
          Pet pet = petRepository.findById(petId)
                  .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

          // 권한 확인 (관리자 or 작성자만 수정 가능)
          if (!member.getRole().equals(UserRole.ADMIN) && !pet.getMember().getId().equals(member.getId())) {
               throw new PetException(PetErrorCode.MEMBER_FORBIDDEN);
          }

          // 수정 내용 반영
          pet.updatePet(requestDto);

          return PetInfoResponseDto.from(pet); //
     }

     public PetInfoResponseDto getPetById(Long id) {
          Pet pet = petRepository.findById(id)
                  .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
          return PetInfoResponseDto.from(pet);
     }

     public List<PetInfoResponseDto> getAllPets() {
          return petRepository.findAll()
                  .stream()
                  .map(PetInfoResponseDto::from)
                  .collect(Collectors.toList());
     }



}
