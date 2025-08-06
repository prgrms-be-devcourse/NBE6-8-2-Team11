package com.back.domain.chat.service;

import com.back.domain.chat.dto.ChatMessageDto;
import com.back.domain.chat.dto.request.ChatMessageRequestDto;
import com.back.domain.chat.dto.response.ChatMessageResponseDto;
import com.back.domain.chat.dto.response.ChatRoomResponseDto;
import com.back.domain.chat.entity.ChatMessage;
import com.back.domain.chat.entity.ChatRoom;
import com.back.domain.chat.repository.ChatMessageRepository;
import com.back.domain.chat.repository.ChatRoomRepository;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notification.entity.Notification;
import com.back.domain.notification.enums.NotificationType;
import com.back.domain.notification.repository.NotificationRepository;
import com.back.domain.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    private final RedisSubscriber redisSubscriber;
    private final NotificationRepository notificationRepository;
    private final NotificationService notificationService;

    @Transactional
    public ChatRoomResponseDto createOrGetChatRoom(Long member1Id, Long member2Id) {
        Member member1 = memberRepository.findById(member1Id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + member1Id));
        Member member2 = memberRepository.findById(member2Id)
                .orElseThrow(() -> new IllegalArgumentException("Member not found: " + member2Id));

        ChatRoom chatRoom = chatRoomRepository.findByMembers(member1, member2)
                .orElseGet(() -> {
                    ChatRoom newRoom = ChatRoom.builder()
                            .firstMember(member1)
                            .secondMember(member2)
                            .build();
                    return chatRoomRepository.save(newRoom);
                });

        // 새로 생성된 채팅방인 경우에만 상대방에게 알림
        if (chatRoom.getCreatedAt() != null &&
            chatRoom.getCreatedAt().isAfter(LocalDateTime.now().minusMinutes(1))) {
            // 상대방에게만 채팅방 생성 알림 전송
            Long myId = !member1Id.equals(member1.getId()) ? member2Id : member1Id;
            Long opponentId = member1Id.equals(member1.getId()) ? member2Id : member1Id;

            Member myMember = memberRepository.findById(myId)
                    .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

            Member opponent = memberRepository.findById(opponentId)
                    .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

            notificationService.sendChatNotification(opponent.getId(), myMember.getName(),
                    "새 채팅방이 생성되었습니다");
            notificationService.sendChatNotification(myId, myMember.getName(),
                    "새 채팅방이 생성되었습니다");


            log.info("New chat room {} created, notified opponent {}", chatRoom.getId(), opponentId);
            notifyChatRoomCreated(chatRoom);
        }

        return ChatRoomResponseDto.from(chatRoom);
    }

    private void notifyChatRoomCreated(ChatRoom chatRoom) {
        // 두 사용자 모두에게 알림 전송
        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatRoom.getFirstMember().getId()),
                "/queue/chat-rooms",
                ChatRoomResponseDto.from(chatRoom)
        );

        messagingTemplate.convertAndSendToUser(
                String.valueOf(chatRoom.getSecondMember().getId()),
                "/queue/chat-rooms",
                ChatRoomResponseDto.from(chatRoom)
        );
    }

    public void enterChatRoom(Long roomId, Long userId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found: " + roomId));

        Member user = memberRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // 상대방 찾기
        Member opponent;
        if (chatRoom.getFirstMember().getId().equals(userId)) {
            opponent = chatRoom.getSecondMember();
        } else {
            opponent = chatRoom.getFirstMember();
        }

        // 상대방에게 채팅방 입장 알림 보내기
        notificationService.sendMessageToUserEnterChatRoom(opponent);

        log.info("User {} entered room {}, notified opponent {}", userId, roomId, opponent.getId());
    }

    @Transactional
    public ChatMessage sendMessage(ChatMessageRequestDto request) {
        ChatRoom chatRoom = chatRoomRepository.findById(request.roomId())
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found: " + request.roomId()));

        Member sender = memberRepository.findById(request.senderId())
                .orElseThrow(() -> new IllegalArgumentException("Sender not found: " + request.senderId()));

        ChatMessage message = ChatMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .content(request.content())
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Redis에 메시지 저장 (최근 100개 메시지, 24시간 유지)
        String redisKey = "chat:room:" + request.roomId() + ":messages";
        ChatMessageDto savedMessageDto = ChatMessageDto.from(savedMessage);
        redisTemplate.opsForList().rightPush(redisKey, savedMessageDto); // rightPush로 변경 (시간순 저장)
        redisTemplate.opsForList().trim(redisKey, -100, -1); // 최근 100개만 유지 (오른쪽에서부터)
        redisTemplate.expire(redisKey, 24, TimeUnit.HOURS);

        // Redis Pub/Sub으로 메시지 발행 (다른 서버 인스턴스에 전달)
        String channel = "chat:room:" + request.roomId();
        ChatMessageDto chatMessageDto = ChatMessageDto.from(savedMessage);
        redisTemplate.convertAndSend(channel, chatMessageDto);

        // WebSocket으로 메시지 전송
        ChatMessageResponseDto response = ChatMessageResponseDto.builder()
                .messageId(savedMessage.getId())
                .roomId(savedMessage.getChatRoom().getId())
                .senderId(savedMessage.getSender().getId())
                .senderName(savedMessage.getSender().getName())
                .content(savedMessage.getContent())
                .sentAt(savedMessage.getSentAt())
                .build();

        String destination = "/topic/chat/" + request.roomId();
        log.info("Sending WebSocket message to destination: {}, message: {}", destination, response);
        messagingTemplate.convertAndSend(destination, response);

        return savedMessage;
    }

    public List<Object> getRecentMessagesFromRedis(Long roomId) {
        String redisKey = "chat:room:" + roomId + ":messages";
        return redisTemplate.opsForList().range(redisKey, 0, -1);
    }

    public List<ChatRoomResponseDto> getUserChatRooms(String memberEmail) {
        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
        List<ChatRoom> chatRooms = chatRoomRepository.findByMember(member);
        return chatRooms.stream()
                .map(ChatRoomResponseDto::from)
                .toList();
    }

    public void viewRecentMessagesToUser(String memberEmail, Long roomId) {
        List<Object> recentMessages = getRecentMessagesFromRedis(roomId);

        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        // Redis에서 가져온 메시지들을 ChatMessageResponse로 변환
        List<ChatMessageResponseDto> messageResponses = recentMessages.stream()
                .filter(obj -> obj instanceof ChatMessageDto)
                .map(obj -> {
                    ChatMessageDto messageDto = (ChatMessageDto) obj;
                    return ChatMessageResponseDto.builder()
                            .messageId(messageDto.id())
                            .roomId(messageDto.chatRoomId())
                            .senderId(messageDto.senderId())
                            .senderName(messageDto.senderName())
                            .content(messageDto.content())
                            .sentAt(messageDto.sentAt())
                            .build();
                })
                .toList();

        // 사용자에게 최근 메시지 전송 -> roomId를 사용하여 특정 사용자에게 전송
        messagingTemplate.convertAndSend("/queue/user/" + roomId + "/messages", messageResponses);

        log.info("Sent {} recent messages to user {} for room {}", messageResponses.size(), member.getId(), roomId);
    }

    @Transactional
    public void deleteChatRoom(Long roomId) {
        ChatRoom chatRoom = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Chat room not found: " + roomId));

        // Redis에서 채팅방 관련 데이터 삭제
        String redisKey = "chat:room:" + roomId + ":messages";
        redisTemplate.delete(redisKey);

        // Redis Pub/Sub 채널 구독 해제
        redisSubscriber.unsubscribeFromChatRoom(roomId);

        // DB에서 채팅방 삭제 (Cascade로 메시지도 자동 삭제)
        chatRoomRepository.delete(chatRoom);

        // 양쪽 사용자에게 채팅방 삭제 알림 전송 (순차적으로)
        Long firstMemberId = chatRoom.getFirstMember().getId();
        Long secondMemberId = chatRoom.getSecondMember().getId();
        
        // 첫 번째 멤버에게 알림
        notificationService.sendChatDeleteNotification(firstMemberId, "채팅방이 삭제되었습니다");
        
        // 잠시 대기 후 두 번째 멤버에게 알림
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        
        notificationService.sendChatDeleteNotification(secondMemberId, "채팅방이 삭제되었습니다");
        log.info("Chat room {} deleted, cleaned Redis data and notified users", roomId);
    }
}