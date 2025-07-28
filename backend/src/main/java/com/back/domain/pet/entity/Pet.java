package com.back.domain.pet.entity;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.care.entity.Care;
import com.back.domain.member.entity.Member;
import com.back.domain.pet.dto.request.PetUpdateRequestDto;
import com.back.domain.pet.enums.Gender;
import com.back.domain.shelter.entity.Shelter;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name = "pet")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pet_id")
    private Long id;

    @Column(name = "pet_name", nullable = false)
    private String name;

    @Column(name = "pet_species", nullable = false)
    private String species;

    @Column(name = "pet_age")
    private int age;

    @Column(name = "pet_gender", nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Lob
    @Column(name = "pet_description")
    private String description;

    @Column(name = "pet_image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shelter_id", nullable = true) //보호소가 없는 경우 존재.
    private Shelter shelter;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetStatus> statuses = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Adoption> adoptions = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PetStatus> petStatuses = new ArrayList<>();

    @OneToMany(mappedBy = "pet", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Care> cares = new ArrayList<>();

    @Builder
    public Pet(Long id, String name, String species, int age, Gender gender, List<PetStatus> petStatuses,
               String description, String imageUrl, Shelter shelter, Member member) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.age = age;
        this.gender = gender;
        this.description = description;
        this.imageUrl = imageUrl;
        this.shelter = shelter;
        this.member = member;
        this.petStatuses = petStatuses;
    }

    public void updatePet(PetUpdateRequestDto dto) {
        this.name = dto.getName();
        this.species = dto.getSpecies();
        this.age = dto.getAge();
        this.gender = dto.getGender();
        this.description = dto.getDescription();
        this.imageUrl = dto.getImageUrl();
        // shelterName은 엔티티에 없다면 생략하거나 shelter로 변환
    }


    public void setPetStatuses(List<PetStatus> petStatuses) {
        this.petStatuses = petStatuses;
        for (PetStatus status : petStatuses) {
            status.setPet(this); // 관계 양방향 유지
        }
    }
}
