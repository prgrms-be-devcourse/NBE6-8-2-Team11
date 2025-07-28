package com.back.domain.chat.service;


import com.back.domain.chat.dto.ChatMessageDto;
import com.back.domain.chat.dto.response.ChatMessageResponseDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class RedisSubscriber {

    private final RedisMessageListenerContainer redisMessageListenerContainer;
    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public void subscribeToChatRoom(Long roomId) {
        String channel = "chat:room:" + roomId;
        ChannelTopic topic = new ChannelTopic(channel);
        
        redisMessageListenerContainer.addMessageListener((message, pattern) -> {
            try {
                // byte[]를 String으로 변환 후 JSON 역직렬화
                byte[] messageBody = message.getBody();
                String jsonString = new String(messageBody);
                ChatMessageDto chatMessageDto = objectMapper.readValue(jsonString, ChatMessageDto.class);
                
                ChatMessageResponseDto response = ChatMessageResponseDto.builder()
                        .messageId(chatMessageDto.id())
                        .roomId(chatMessageDto.chatRoomId())
                        .senderId(chatMessageDto.senderId())
                        .senderName(chatMessageDto.senderName())
                        .content(chatMessageDto.content())
                        .sentAt(chatMessageDto.sentAt())
                        .build();

                messagingTemplate.convertAndSend("/topic/chat/" + roomId, response);
                log.info("Message sent to room {}: {}", roomId, response.content());
                
            } catch (Exception e) {
                log.error("Error processing message for room {}: {}", roomId, e.getMessage(), e);
            }
        }, topic);
        
        log.info("Subscribed to chat room: {}", roomId);
    }

    public void unsubscribeFromChatRoom(Long roomId) {
        String channel = "chat:room:" + roomId;
        ChannelTopic topic = new ChannelTopic(channel);
        redisMessageListenerContainer.removeMessageListener(null, topic);
        log.info("Unsubscribed from chat room: {}", roomId);
    }
} 