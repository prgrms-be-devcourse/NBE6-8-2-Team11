package com.back.domain.adoption.service;

import com.back.domain.adoption.dto.request.AdoptionOrCareSearchRequestDto;
import com.back.domain.adoption.dto.request.AdoptionRequestDto;
import com.back.domain.adoption.dto.response.AdoptionResponseDto;
import com.back.domain.adoption.dto.response.ApplicationResponseDto;
import com.back.domain.adoption.dto.response.ApplicationSimpleListResponseDto;
import com.back.domain.adoption.entity.Adoption;
import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.adoption.repository.AdoptionRepository;
import com.back.domain.care.entity.Care;
import com.back.domain.care.repository.CareRepository;
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

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdoptionService {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final AdoptionRepository adoptionRepository;
    private final CareRepository careRepository;

    public AdoptionResponseDto applyAdoption(AdoptionRequestDto adoptionRequestDto) {
        Member member = memberRepository.findById(adoptionRequestDto.memberId())
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Pet pet = petRepository.findById(adoptionRequestDto.petId())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        Adoption adoption = Adoption.builder()
                .member(member)
                .pet(pet)
                .title(adoptionRequestDto.title())
                .message(adoptionRequestDto.message())
                .status(RequestStatus.PENDING)
                .build();

        return AdoptionResponseDto.from(adoption);
    }

    public List<ApplicationSimpleListResponseDto> getMemberApplications(String memberEmail) {
        Member member = getMemberByEmail(memberEmail);

        List<Adoption> adoptions = adoptionRepository.findByMemberOrderByCreatedAtDesc(member);
        List<Care> cares = careRepository.findByMemberOrderByCreatedAtDesc(member);

        List<ApplicationSimpleListResponseDto> applications = new ArrayList<>();

        for (Adoption adoption : adoptions) {
            applications.add(ApplicationSimpleListResponseDto.fromAdoption(adoption));
        }

        for (Care care : cares) {
            applications.add(ApplicationSimpleListResponseDto.fromCare(care));
        }
        // createdAt 기준으로 내림차순 정렬 (최신순)
        applications.sort(Comparator.comparing(ApplicationSimpleListResponseDto::createdAt).reversed());

        return applications;
    }

    public ApplicationResponseDto getApplicationDetails(AdoptionOrCareSearchRequestDto requestDto, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getApplicationEntity(requestDto, member);

        if (entity instanceof Adoption adoption) {
            return ApplicationResponseDto.fromAdoption(adoption);
        } else if (entity instanceof Care care) {
            return ApplicationResponseDto.fromCare(care);
        }
        throw new IllegalArgumentException("Invalid application type: " + requestDto.type());
    }

    public void deleteSingleHistory(AdoptionOrCareSearchRequestDto requestDto, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getApplicationEntity(requestDto, member);

        if (entity instanceof Adoption adoption) {
            adoptionRepository.delete(adoption);
        } else if (entity instanceof Care care) {
            careRepository.delete(care);
        }
    }

    public void deleteAllHistory(String memberEmail) {
        Member member = getMemberByEmail(memberEmail);

        List<Adoption> adoptions = adoptionRepository.findByMember(member);
        List<Care> cares = careRepository.findByMember(member);

        for (Adoption adoption : adoptions) {
            adoptionRepository.delete(adoption);
        }

        for (Care care : cares) {
            careRepository.delete(care);
        }
    }

    private Member getMemberByEmail(String memberEmail) {
        return memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    private Object getApplicationEntity(AdoptionOrCareSearchRequestDto requestDto, Member member) {
        if (requestDto.type().equals("ADOPTION")) {
            return adoptionRepository.findByIdAndMember(requestDto.id(), member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else if (requestDto.type().equals("CARE")) {
            return careRepository.findByIdAndMember(requestDto.id(), member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else {
            throw new IllegalArgumentException("Invalid application type: " + requestDto.type());
        }
    }

}
