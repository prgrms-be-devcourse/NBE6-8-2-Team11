package com.back.domain.chat.dto;

import com.back.domain.chat.entity.ChatMessage;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;
import lombok.Builder;

@Builder
public record ChatMessageDto(
        Long id,
        String content,
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime sentAt,
        Long chatRoomId,
        Long senderId,
        String senderName
) {
    public static ChatMessageDto from(ChatMessage chatMessage) {
        return ChatMessageDto.builder()
                .id(chatMessage.getId())
                .content(chatMessage.getContent())
                .sentAt(chatMessage.getSentAt())
                .chatRoomId(chatMessage.getChatRoom().getId())
                .senderId(chatMessage.getSender().getId())
                .senderName(chatMessage.getSender().getName())
                .build();
    }
}
