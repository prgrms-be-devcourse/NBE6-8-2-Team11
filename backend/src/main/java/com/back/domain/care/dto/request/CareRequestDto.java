package com.back.domain.care.dto.request;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Builder;
import org.springframework.context.annotation.Description;

@Builder
public record CareRequestDto(
        @NotNull
        Long petId,

        @NotNull
        String title,

        String anotherPets,

        String experience,

        String message,

        @NotNull
        LocalDateTime desiredStartDate,

        @Description("요청자가 원하는 돌봄 종료 날짜 - 무기한이 가능하므로 비어있을 수 있음")
        LocalDateTime desiredEndDate
) {

}
