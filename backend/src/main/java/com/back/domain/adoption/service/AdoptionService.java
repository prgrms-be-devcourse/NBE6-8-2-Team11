package com.back.domain.adoption.service;

import com.back.domain.adoption.dto.request.AdoptionCareStatusUpdateRequestDto;
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
import com.back.domain.notification.service.NotificationService;
import com.back.domain.pet.entity.Pet;
import com.back.domain.pet.entity.PetStatus;
import com.back.domain.pet.enums.PetStatusType;
import com.back.domain.pet.exception.PetErrorCode;
import com.back.domain.pet.exception.PetException;
import com.back.domain.pet.repository.PetRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AdoptionService {

    private final MemberRepository memberRepository;
    private final PetRepository petRepository;
    private final AdoptionRepository adoptionRepository;
    private final CareRepository careRepository;
    private final NotificationService notificationService;

    public AdoptionResponseDto applyAdoption(AdoptionRequestDto adoptionRequestDto, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);

        Pet pet = petRepository.findById(adoptionRequestDto.petId())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        boolean isAvailableForAdoption = pet.getPetStatuses().stream()
                .anyMatch(status -> status.getStatus().equals(PetStatusType.AVAILABLE_FOR_ADOPTION) ||
                        status.getStatus().equals(PetStatusType.AVAILABLE_BOTH));

        if (!isAvailableForAdoption) {
            throw new PetException(PetErrorCode.PET_NOT_AVAILABLE_FOR_CARE);
        }

        Adoption adoption = Adoption.builder()
                .member(member)
                .pet(pet)
                .title(adoptionRequestDto.title())
                .anotherPets(adoptionRequestDto.anotherPets())
                .experience(adoptionRequestDto.experience())
                .message(adoptionRequestDto.message())
                .status(RequestStatus.PENDING)
                .build();
        adoptionRepository.save(adoption);
        notificationService.sendAdoptionRequestNotification(member.getId(), "입양을 신청하였습니다.", member.getName());

        notificationService.sendAdoptionRequestNotification(pet.getMember().getId(), "입양 신청이 도착하였습니다.", member.getName());

        return AdoptionResponseDto.from(adoption);
    }

    @Transactional(readOnly = true)
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

    @Transactional(readOnly = true)
    public ApplicationResponseDto getApplicationDetails(Long typeId, String type, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getApplicationEntity(type, typeId, member);

        if (entity instanceof Adoption adoption) {
            return ApplicationResponseDto.fromAdoption(adoption);
        } else if (entity instanceof Care care) {
            return ApplicationResponseDto.fromCare(care);
        }
        throw new IllegalArgumentException("Invalid application type: " + type);
    }

    public void deleteSingleHistory(Long typeId, String type, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getApplicationEntity(type, typeId, member);

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

    @Transactional(readOnly = true)
    public List<ApplicationSimpleListResponseDto> getReceivedApplications(String memberEmail) {
        Member member = getMemberByEmail(memberEmail);

        List<Adoption> adoptions = adoptionRepository.findByPet_MemberOrderByCreatedAtDesc(member);
        List<Care> cares = careRepository.findByPet_MemberOrderByCreatedAtDesc(member);

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

    @Transactional(readOnly = true)
    public ApplicationResponseDto getReceivedApplicationDetails(
            Long typeId, String type, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getReceivedApplicationEntity(type, typeId, member);

        if (entity instanceof Adoption adoption) {
            return ApplicationResponseDto.fromAdoption(adoption);
        } else if (entity instanceof Care care) {
            return ApplicationResponseDto.fromCare(care);
        }
        throw new IllegalArgumentException("Invalid application type: " + type);
    }

    public void updateReceivedApplicationStatus(AdoptionCareStatusUpdateRequestDto requestDto, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getReceivedApplicationEntity(requestDto.type(), requestDto.id(), member);

        Pet pet = petRepository.findById(requestDto.id())
                .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));

        RequestStatus newStatus = RequestStatus.valueOf(requestDto.status());

        if (newStatus == RequestStatus.REJECTED) {
            updateApplicationStatus(entity, newStatus);
            notificationService.sendResponseNotification(member.getId(), "신청을 거절되었습니다.", requestDto.type(), false);
            notificationService.sendResponseNotification(pet.getMember().getId(), "신청이 거절되었습니다.", requestDto.type(), false);
            return;
        }

        // ACCEPTED인 경우 PetStatus도 함께 업데이트
        updateApplicationStatusWithPetStatus(entity, newStatus);
        notificationService.sendResponseNotification(member.getId(), "신청을 승인하셨습니다.", requestDto.type(), true);
        notificationService.sendResponseNotification(pet.getMember().getId(), "신청이 승인되셨습니다.", requestDto.type(), true);
    }

    public void deleteReceivedSingleHistory(Long typeId, String type, String memberEmail) {
        Member member = getMemberByEmail(memberEmail);
        Object entity = getReceivedApplicationEntity(type, typeId, member);

        if (entity instanceof Adoption adoption) {
            adoptionRepository.delete(adoption);
        } else if (entity instanceof Care care) {
            careRepository.delete(care);
        }
    }

    public void deleteOwnerAllHistory(String memberEmail) {
        Member member = getMemberByEmail(memberEmail);

        List<Adoption> adoptions = adoptionRepository.findByPet_MemberOrderByCreatedAtDesc(member);
        List<Care> cares = careRepository.findByPet_MemberOrderByCreatedAtDesc(member);

        for (Adoption adoption : adoptions) {
            adoptionRepository.delete(adoption);
        }

        for (Care care : cares) {
            careRepository.delete(care);
        }
    }

    @Transactional(readOnly = true)
    private Member getMemberByEmail(String memberEmail) {
        return memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    private Object getApplicationEntity(String type, Long id, Member member) {
        if (type.equals("ADOPTION")) {
            return adoptionRepository.findByIdAndMember(id, member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else if (type.equals("CARE")) {
            return careRepository.findByIdAndMember(id, member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else {
            throw new IllegalArgumentException("Invalid application type: " + type);
        }
    }

    @Transactional(readOnly = true)
    private Object getReceivedApplicationEntity(String type, Long id, Member member) {
        if (type.equals("ADOPTION")) {
            return adoptionRepository.findByIdAndPet_Member(id, member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else if (type.equals("CARE")) {
            return careRepository.findByIdAndPet_Member(id, member)
                    .orElseThrow(() -> new PetException(PetErrorCode.PET_NOT_FOUND));
        } else {
            throw new IllegalArgumentException("Invalid application type: " + type);
        }
    }

    private void updateApplicationStatus(Object entity, RequestStatus status) {
        if (entity instanceof Adoption adoption) {
            adoption.updateStatus(status);
            adoptionRepository.save(adoption);
        } else if (entity instanceof Care care) {
            care.updateStatus(status);
            careRepository.save(care);
        } else {
            throw new IllegalArgumentException("Invalid application type");
        }
    }

    private void updateApplicationStatusWithPetStatus(Object entity, RequestStatus status) {
        if (entity instanceof Adoption adoption) {
            adoption.updateStatus(status);
            updatePetStatus(adoption.getPet(), PetStatusType.ADOPTED);
            adoptionRepository.save(adoption);
        } else if (entity instanceof Care care) {
            care.updateStatus(status);
            updatePetStatus(care.getPet(), PetStatusType.CARE_COMPLETED);
            careRepository.save(care);
        } else {
            throw new IllegalArgumentException("Invalid application type");
        }
    }

    private void updatePetStatus(Pet pet, PetStatusType newStatus) {
        pet.getPetStatuses().clear();
        pet.getPetStatuses().add(
                PetStatus.builder()
                        .status(newStatus)
                        .pet(pet)
                        .build()
        );
    }

}
