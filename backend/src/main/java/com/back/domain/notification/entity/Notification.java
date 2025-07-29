package com.back.domain.notification.entity;

import com.back.domain.adoption.entity.Adoption;
import com.back.domain.care.entity.Care;
import com.back.domain.member.entity.Member;
import com.back.domain.notification.enums.NotificationType;
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
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@Table(name = "notification")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @Column(name = "notification_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(name = "notification_title", nullable = false)
    private String title;

    @Lob
    @Column(name = "notification_message", nullable = false)
    private String message;

    @Column(name = "notification_is_read")
    private boolean isRead = false;

    @CreatedDate
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "adoption_id")
    private Adoption adoption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "care_id")
    private Care care;

    @Builder
    public Notification(NotificationType type, String title, String message, Member member, Adoption adoption, Care care) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.member = member;
        this.adoption = adoption;
        this.care = care;
    }

    public void setMember(Member firstMember) {
        this.member = firstMember;
    }

    public void markAsRead() {
        if (!isRead) {
            this.isRead = true;
        } else {
            this.isRead = false;
        }
    }
}
