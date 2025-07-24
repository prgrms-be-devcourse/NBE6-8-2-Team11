package com.back.domain.care.service;

import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.care.dto.request.CareRequestDto;
import com.back.domain.care.dto.response.CareResponseDto;
import com.back.domain.care.entity.Care;
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
public class CareService {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;


    public CareResponseDto applyCare(CareRequestDto careRequestDto) {
        Member member = memberRepository.findById(careRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Pet pet = petRepository.findById(careRequestDto.petId())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        Care care = Care.builder()
                .member(member)
                .pet(pet)
                .message(careRequestDto.message())
                .desiredStartDate(careRequestDto.desiredStartDate())
                .desiredEndDate(careRequestDto.desiredEndDate())
                .status(RequestStatus.PENDING)
                .build();

        return CareResponseDto.from(care);
    }
}
