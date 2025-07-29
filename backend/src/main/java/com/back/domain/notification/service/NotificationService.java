package com.back.domain.notification.service;


import com.back.domain.member.entity.Member;
import com.back.domain.member.exception.MemberErrorCode;
import com.back.domain.member.exception.MemberException;
import com.back.domain.member.repository.MemberRepository;
import com.back.domain.notification.dto.response.NotificationResponseDto;
import com.back.domain.notification.entity.Notification;
import com.back.domain.notification.repository.NotificationRepository;
import com.back.global.exception.CustomException;
import com.back.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<NotificationResponseDto> getNotificationsList(String memberEmail) {
        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(()->new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        List<Notification> notifications = notificationRepository.findByMemberOrderByCreatedAtDesc(member);
        return notifications.stream()
                .map(NotificationResponseDto::from)
                .collect(Collectors.toList());
    }

    public void deleteNotification(String memberEmail, Long notificationId) {

        Member member = memberRepository.findByEmail(memberEmail)
                .orElseThrow(()->new MemberException(MemberErrorCode.MEMBER_NOT_FOUND));

        Notification notification = notificationRepository.findByIdAndMember(notificationId, member)
                .orElseThrow(() -> new CustomException(ErrorCode.NOTI_NOT_FOUND));

        notificationRepository.delete(notification);
    }

}
