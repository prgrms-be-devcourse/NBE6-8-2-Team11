package com.back.domain.notification.controller;


import com.back.domain.notification.dto.response.NotificationResponseDto;
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
    public ResponseEntity<ApiResponse<List<NotificationResponseDto>>> getNotificationsList(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<NotificationResponseDto> notifications = notificationService.getNotificationsList(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.OK).body(
                ApiResponse.success(notifications));
    }

    @DeleteMapping("/{notificationId}")
    @Operation(summary = "알림 삭제", description = "사용자의 알림을 삭제합니다")
    public ResponseEntity<ApiResponse<Void>> deleteNotification(
            @PathVariable Long notificationId,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.deleteNotification(userDetails.getUsername(), notificationId);
        return ResponseEntity.ok(ApiResponse.success("알림이 삭제되었습니다.", null));
    }



}
