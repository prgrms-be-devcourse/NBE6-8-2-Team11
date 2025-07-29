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
    public void sendRealTimeNotification(String memberEmail, NotificationType type, String title, String message) {
        // DB에 알림 저장
        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
        
        Notification notification = Notification.builder()
                .member(member)
                .type(type)
                .message(message)
                .title(title)
                .build();
        
        notificationRepository.save(notification);
        
        // WebSocket으로 실시간 전송
        NotificationResponseDto notificationDto = NotificationResponseDto.from(notification);
        messagingTemplate.convertAndSendToUser(
            memberEmail,  // WebSocket 세션에 저장된 사용자 식별자와 일치해야 함
            "/queue/notifications",
            notificationDto
        );
        
        log.info("Real-time notification sent to user: {}", member.getName());
    }

    /**
     * 채팅방에 알림 전송
     */
    public void sendMessageToUserEnterChatRoom(Member opponent) {
        Notification notificationMessage = Notification.builder()
                .title("새 채팅방 입장")
                .message("새로운 채팅방에 입장하었습니다. 채팅을 시작하세요!")
                .member(opponent)
                .type(NotificationType.NEW_MESSAGE)
                .build();
        notificationRepository.save(notificationMessage);
        messagingTemplate.convertAndSend("/queue/notifications" + opponent.getId(), notificationMessage.getTitle());
    }

    /**
     * 돌봄 신청 알림 전송
     */
    public void sendAdoptionRequestNotification(String recipientUsername, String title, String requesterName) {
        String message = requesterName + "님이 돌봄을 신청했습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.ADOPTION_REQUESTED, title, message);
    }

    /**
     * 돌봄 신청 알림 전송
     */
    public void sendCareRequestNotification(String recipientUsername, String title, String requesterName) {
        String message = requesterName + "님이 돌봄을 신청했습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.CARE_REQUESTED, title, message);
    }

    /**
     * 돌봄 승인/거절 알림 전송
     */
    public void sendResponseNotification(String recipientUsername, String title, String type, boolean isAccepted) {
        NotificationType notificationType = null;
        if (type.equals("ADOPTION")) {
            notificationType = isAccepted ? NotificationType.ADOPTION_ACCEPTED : NotificationType.ADOPTION_REJECTED;
        } else  {
            notificationType = isAccepted ? NotificationType.CARE_ACCEPTED : NotificationType.CARE_REJECTED;
        }
        String message = "신청이 " + (isAccepted ? "승인" : "거절") + "되었습니다.";
        sendRealTimeNotification(recipientUsername, notificationType, title, message);
    }

    /**
     * 채팅 메시지 알림 전송
     */
    public void sendChatNotification(String recipientUsername, String senderName, String title, Long roomId) {
        String message = senderName + "님이 메시지를 보냈습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.NEW_MESSAGE, title, message);
    }

    /**
     * 채팅 메시지 알림 전송
     */
    public void sendChatDeleteNotification(String recipientUsername, String title, Long roomId) {
        String message = "채팅방이 삭제되었습니다.";
        sendRealTimeNotification(recipientUsername, NotificationType.CHAT_ROOM_DELETED, title, message);
    }
}
