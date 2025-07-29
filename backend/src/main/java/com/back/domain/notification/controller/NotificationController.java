package com.back.domain.notification.controller;


import com.back.domain.notification.dto.response.NotificationResponseDto;
import com.back.domain.notification.dto.response.NotificationSimpleResponseDto;
import com.back.domain.notification.service.NotificationService;
import com.back.global.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/notifications")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    @Operation(summary = "알림 목록 조회", description = "사용자의 모든 알림을 조회합니다.")
    public ResponseEntity<ApiResponse<List<NotificationSimpleResponseDto>>> getNotificationsList(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<NotificationSimpleResponseDto> notifications = notificationService.getNotificationsList(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(notifications));
    }

    @GetMapping("/{notificationId}")
    @Operation(summary = "알림 상세 조회", description = "특정 알림의 상세 정보를 조회합니다.")
    public ResponseEntity<ApiResponse<NotificationResponseDto>> getNotificationDetail(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        NotificationResponseDto notification = notificationService.getNotificationDetail(userDetails.getUsername(), notificationId);
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(notification)
        );
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "알림 삭제", description = "사용자의 알림을 삭제합니다")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteNotification(userDetails.getUsername(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("알림이 삭제되었습니다.", null));
    }

    @DeleteMapping("/all")
    @Operation(summary = "알림 전체 삭제", description = "사용자의 알림을 전체 삭제합니다")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteAllNotification(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("알림이 삭제되었습니다.", null));
    }

}
