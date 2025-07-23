package com.back.domain.pet.entity;

import com.back.domain.member.entity.Member;
import com.back.domain.pet.enums.Gender;
import com.back.domain.shelter.entity.Shelter;
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
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
}
