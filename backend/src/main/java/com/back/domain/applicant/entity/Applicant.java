package com.back.domain.applicant.entity;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.care.entity.Care;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "applicant")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Applicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "applicant_id")
    private Long id;

    @Column(name = "applicant_name", nullable = false)
    private String name;

    @Column(name = "applicant_phone", nullable = false)
    private String phone;

    @Column(name = "applicant_email", nullable = false)
    private String email;

    @Column(name = "applicant_address", nullable = false)
    private String address;

    @OneToOne(mappedBy = "applicant")
    private Adoption adoption;

    @OneToOne(mappedBy = "applicant")
    private Care care;

    @Builder
    public Applicant(String name, String phone, String email, String address,
                    Adoption adoption, Care care) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.adoption = adoption;
        this.care = care;
    }

}
