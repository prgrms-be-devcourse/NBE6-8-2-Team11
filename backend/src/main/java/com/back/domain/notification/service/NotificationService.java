package com.back.domain.notification.service;


import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notification.dto.response.NotificationResponseDto;
import com.back.domain.notification.dto.response.NotificationSimpleResponseDto;
import com.back.domain.notification.entity.Notification;
import com.back.domain.notification.repository.NotificationRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.back.domain.notification.enums.NotificationType;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional(readOnly = true)
    public List<NotificationSimpleResponseDto> getNotificationsList(String memberEmail) {
        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(()->new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        List<Notification> notifications = notificationRepository.findByMemberOrderByCreatedAtDesc(member);
        return notifications.stream()
                .map(NotificationSimpleResponseDto::from)
                .collect(Collectors.toList());
    }

    public void deleteNotification(String memberEmail, Long notificationId) {

        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(()->new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Notification notification = notificationRepository.findByIdAndMember(notificationId, member)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTI_NOT_FOUND));

        notificationRepository.delete(notification);
    }

    public NotificationResponseDto getNotificationDetail(String username, Long notificationId) {
        Member member = memberRepository.findByEmail(username)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Notification notification = notificationRepository.findByIdAndMember(notificationId, member)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTI_NOT_FOUND));

        // 알림을 읽음 처리
        notification.markAsRead();
        notificationRepository.save(notification);

        return NotificationResponseDto.from(notification);
    }

    /**
     * 실시간 알림 전송 - 개별 사용자
     */
    public void sendRealTimeNotification(String username, NotificationType type, String message) {
        // DB에 알림 저장
        Member member = memberRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Member not found"));
        
        Notification notification = Notification.builder()
                .member(member)
                .type(type)
                .message(message)
                .isRead(false)
                .build();
        
        notificationRepository.save(notification);
        
        // WebSocket으로 실시간 전송
        NotificationResponseDto notificationDto = NotificationResponseDto.from(notification);
        messagingTemplate.convertAndSendToUser(
            username,
            "/queue/notifications",
            notificationDto
        );
        
        log.info("Real-time notification sent to user: {}", username);
    }

    /**
     * 실시간 알림 전송 - 전체 브로드캐스트
     */
    public void sendBroadcastNotification(NotificationType type, String message) {
        // WebSocket으로 전체 브로드캐스트
        messagingTemplate.convertAndSend(
            "/topic/notifications",
            new NotificationResponseDto(null, type, message, false)
        );
        
        log.info("Broadcast notification sent to all users");
    }

    /**
     * 돌봄 신청 알림 전송
     */
    public void sendCareRequestNotification(String recipientUsername, String requesterName) {
        String message = requesterName + "님이 돌봄을 신청했습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.CARE_REQUESTED, message);
    }

    /**
     * 돌봄 승인/거절 알림 전송
     */
    public void sendCareResponseNotification(String recipientUsername, String responderName, boolean isAccepted) {
        NotificationType type = isAccepted ? NotificationType.CARE_ACCEPTED : NotificationType.CARE_REJECTED;
        String message = responderName + "님이 돌봄 신청을 " + (isAccepted ? "승인" : "거절") + "했습니다.";
        sendRealTimeNotification(recipientUsername, type, message);
    }

    /**
     * 채팅 메시지 알림 전송
     */
    public void sendChatNotification(String recipientUsername, String senderName, String roomId) {
        String message = senderName + "님이 메시지를 보냈습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.NEW_MESSAGE, message);
    }
}
