package com.back.domain.notification.dto.response;

import com.back.domain.notification.entity.Notification;
import com.back.domain.notification.enums.NotificationType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record NotificationResponseDto (
        Long notificationId,
        NotificationType type,
        String title,
        String message,
        boolean isRead,
        LocalDateTime createdAt
){
    public static NotificationResponseDto from(Notification notification) {

        return NotificationResponseDto.builder()
                .notificationId(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }

}
