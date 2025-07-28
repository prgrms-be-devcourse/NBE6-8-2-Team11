package com.back.domain.chat.dto.request;

import lombok.Builder;

@Builder
public record ChatMessageRequestDto(
    Long roomId,
    Long senderId,
    String content
) {
} 