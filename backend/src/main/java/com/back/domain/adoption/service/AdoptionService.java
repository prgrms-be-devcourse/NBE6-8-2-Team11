package com.back.domain.adoption.service;

import com.back.domain.adoption.dto.request.AdoptionRequestDto;
import com.back.domain.adoption.dto.response.AdoptionResponseDto;
import com.back.domain.adoption.entity.Adoption;
import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.exception.PetErrorCode;
import com.back.domain.pet.exception.PetException;
import com.back.domain.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;

    public AdoptionResponseDto applyAdoption(AdoptionRequestDto adoptionRequestDto) {
        Member member = memberRepository.findById(adoptionRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Pet pet = petRepository.findById(adoptionRequestDto.petId())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        Adoption adoption = Adoption.builder()
                .member(member)
                .pet(pet)
                .message(adoptionRequestDto.message())
                .status(RequestStatus.PENDING)
                .build();

        return AdoptionResponseDto.from(adoption);
    }
}
