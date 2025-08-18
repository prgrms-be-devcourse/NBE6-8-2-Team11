package com.back.domain.care.entity;

import com.back.domain.adoption.enums.RequestStatus;
import com.back.domain.applicant.entity.Applicant;
import com.back.domain.member.entity.Member;
import com.back.domain.notification.entity.Notification;
import com.back.domain.pet.entity.Pet;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "care")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Care {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "care_id")
    private Long id;

    @Column(name = "care_title", nullable = false)
    private String title;

    @Column(name = "care_another_pets")
    private String anotherPets;

    @Lob
    @Column(name = "care_experience")
    private String experience;

    @Lob
    @Column(name = "care_message", nullable = false)
    private String message;

    @Column(name = "care_desired_start_date")
    private LocalDateTime desiredStartDate;

    @Column(name = "care_desired_end_date")
    private LocalDateTime desiredEndDate;

    @Column(name = "care_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @CreatedDate
    private LocalDateTime createdAt;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "applicant_id")
    private Applicant applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @OneToMany(mappedBy = "care", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    @Builder
    public Care(String title, String message, LocalDateTime desiredStartDate, String anotherPets, String experience,
                LocalDateTime desiredEndDate, RequestStatus status, Member member, Pet pet, Applicant applicant) {
        this.title = title;
        this.message = message;
        this.desiredStartDate = desiredStartDate;
        this.desiredEndDate = desiredEndDate;
        this.status = status;
        this.member = member;
        this.pet = pet;
        this.anotherPets = anotherPets;
        this.experience = experience;
        this.applicant = applicant;
    }

    public void updateStatus(RequestStatus status) {
        this.status = status;
    }
}