package com.back.domain.shelter.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "shelter")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Shelter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shelter_id")
    private Long id;

    @Column(name = "shelter_name", nullable = false)
    private String name;

    @Column(name = "shelter_address", nullable = false)
    private String address;

    @Column(name = "shelter_city")
    private String city;

    @Column(name = "shelter_state")
    private String state;

    @Column(name = "shelter_zip_code")
    private String zipCode;

    @Column(name = "shelter_phone")
    private String phone;

    @CreatedDate
    private LocalDateTime createdAt;
}
