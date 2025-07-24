package com.back.domain.member.service;


import com.back.domain.member.dto.request.MemberUpdateRequestDto;
import com.back.domain.member.dto.response.MemberResponseDto;
import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public MemberResponseDto getMemberInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));
        return MemberResponseDto.from(member);
    }

    @Transactional
    public MemberResponseDto updateMemberInfo(Long memberId, MemberUpdateRequestDto requestDto, UserDetails userDetails) {
        Member memberToUpdate = memberRepository.findById(memberId)
                .orElseThrow(() -> new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        if (!memberToUpdate.getEmail().equals(userDetails.getUsername())) {
            throw new RuntimeException("수정할 권한이 없습니다.");
        }

        memberToUpdate.updateInfo(requestDto.name(), requestDto.phone());

        if (requestDto.newPassword() != null && !requestDto.newPassword().isBlank()) {
            if (!passwordEncoder.matches(requestDto.currentPassword(), memberToUpdate.getPassword())) {
                throw new MemberException(MemberErrorCode.AUTH_LOGIN_FAILED);
            }

            memberToUpdate.updatePassword(passwordEncoder.encode(requestDto.newPassword()));
        }

        return MemberResponseDto.from(memberToUpdate);
    }
}
