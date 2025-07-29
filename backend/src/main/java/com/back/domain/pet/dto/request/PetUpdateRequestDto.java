package com.back.domain.pet.dto.request;

import com.back.domain.pet.enums.Gender;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class PetUpdateRequestDto {

    @NotBlank(message = "이름은 필수입니다.")
    private String name;

    @NotBlank(message = "품종은 필수입니다.")
    private String species;

    @Min(value = 0, message = "나이는 0 이상이어야 합니다.")
    private Integer age;

    @NotNull(message = "성별은 필수입니다.")
    private Gender gender;

    private String description;

    private String imageUrl;

    private String shelterName;

    List<String> statuses;

}
