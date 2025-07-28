package com.back.domain.chat.dto.response;

import com.back.domain.chat.entity.ChatRoom;
import com.back.domain.member.entity.Member;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ChatRoomResponseDto(
        Long id,
        LocalDateTime createdAt,
        Long firstMemberId,
        Long secondMemberId
) {
    public static ChatRoomResponseDto from(ChatRoom chatRoom) {
        return ChatRoomResponseDto.builder()
                .id(chatRoom.getId())
                .createdAt(chatRoom.getCreatedAt())
                .firstMemberId(chatRoom.getFirstMember().getId())
                .secondMemberId(chatRoom.getSecondMember().getId())
                .build();
    }
}