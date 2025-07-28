package com.back.domain.chat.dto.response;

import com.back.domain.chat.entity.ChatMessage;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ChatMessageResponseDto(
        Long messageId,
        Long roomId,
        Long senderId,
        String senderName,
        String content,
        LocalDateTime sentAt
) {
    public static ChatMessageResponseDto from(ChatMessage chatMessage) {
        return ChatMessageResponseDto.builder()
                .messageId(chatMessage.getId())
                .roomId(chatMessage.getChatRoom().getId())
                .senderId(chatMessage.getSender().getId())
                .senderName(chatMessage.getSender().getName())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .build();
    }
} 