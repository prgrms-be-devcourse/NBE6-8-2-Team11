package com.back.domain.pet.entity;


import com.back.domain.pet.enums.PetStatusType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Getter
@Setter
@Table(name = "pet_status")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PetStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_status_id")
    private Long id;

    @Column(name = "pet_status_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private PetStatusType status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Builder
    public PetStatus(PetStatusType status, Pet pet) {
        this.status = status;
        this.pet = pet;
    }

    public void updateStatus(PetStatusType petStatusType) {
        this.status = petStatusType;
    }
}
