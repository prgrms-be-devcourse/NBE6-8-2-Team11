package com.back.domain.notification.dto.response;

import com.back.domain.notification.entity.Notification;
import com.back.domain.notification.enums.NotificationType;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record NotificationSimpleResponseDto(
        Long notificationId,
        NotificationType type,
        String title,
        boolean isRead
){
    public static NotificationSimpleResponseDto from(Notification notification) {

        return NotificationSimpleResponseDto.builder()
                .notificationId(notification.getId())
                .type(notification.getType())
                .title(notification.getTitle())
                .isRead(notification.isRead())
                .build();
    }

}
