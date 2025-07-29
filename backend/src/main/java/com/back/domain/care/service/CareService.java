package com.back.domain.care.service;

import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.care.dto.request.CareRequestDto;
import com.back.domain.care.dto.response.CareResponseDto;
import com.back.domain.care.entity.Care;
import com.back.domain.care.repository.CareRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notification.service.NotificationService;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.enums.PetStatusType;
import com.back.domain.pet.exception.PetErrorCode;
import com.back.domain.pet.exception.PetException;
import com.back.domain.pet.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CareService {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final CareRepository careRepository;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;


    public CareResponseDto applyCare(CareRequestDto careRequestDto, String memberEmail) {
        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Pet pet = petRepository.findById(careRequestDto.petId())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        boolean isAvailableForCare = pet.getStatuses().stream()
                .anyMatch(status -> status.getStatus().equals(PetStatusType.AVAILABLE_FOR_CARE));

        if (!isAvailableForCare) {
            throw new PetException(PetErrorCode.PET_NOT_AVAILABLE_FOR_CARE);
        }

        Care care = Care.builder()
                .member(member)
                .pet(pet)
                .title(careRequestDto.title())
                .message(careRequestDto.message())
                .desiredStartDate(careRequestDto.desiredStartDate())
                .desiredEndDate(careRequestDto.desiredEndDate())
                .status(RequestStatus.PENDING)
                .build();
        careRepository.save(care);

       notificationService.sendCareRequestNotification(pet.getMember().getUsername(), "동물 돌봄 신청이 도착하였습니다", member.getName());

        return CareResponseDto.from(care);
    }
}
