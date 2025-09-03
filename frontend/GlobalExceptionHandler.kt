package com.back.global.exception

import com.back.domain.chat.exception.ChatException
import com.back.domain.member.exception.MemberException
import com.back.domain.pet.exception.PetException
import com.back.global.common.ApiResponse
import org.slf4j.LoggerFactory
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.AccessDeniedException
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

/**
 * 전역 예외 처리 핸들러
 */
@RestControllerAdvice
class GlobalExceptionHandler {
    
    companion object {
        private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)
    }

    // 커스텀할 예외 처리 핸들러
    @ExceptionHandler(CustomException::class)
    fun handleCustomException(e: CustomException): ResponseEntity<ApiResponse<Void?>> {
        log.info(e.message, e)
        val response = ApiResponse.fail<Void>(e.code, e.errorCode.message)
        return ResponseEntity.status(e.httpStatus).body(response)
    }

    /**
     * 해당 부분 하단에 위 커스텀 예외 핸들러처럼 직접 제작하신 커스텀 예외 등록하시면 됩니다.
     * 어노테이션의 인자, 메서드 명, 파라미터 바꾸셔야 합니다.
     */
    @ExceptionHandler(MemberException::class)
    fun handleMemberException(e: MemberException): ResponseEntity<ApiResponse<Void?>> {
        log.info(e.message, e)
        val response = ApiResponse.fail<Void>(e.code, e.message)
        return ResponseEntity.status(e.httpStatus).body(response)
    }

    @ExceptionHandler(PetException::class)
    fun handlePetException(e: PetException): ResponseEntity<ApiResponse<Void?>> {
        log.info(e.message, e)
        val response = ApiResponse.fail<Void>(e.code, e.message)
        return ResponseEntity.status(e.httpStatus).body(response)
    }

    // 유효성 검사 예외 처리 핸들러
    // DTO에서 @Valid 어노테이션을 사용한 경우 발생하는 예외 처리
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(e: MethodArgumentNotValidException): ResponseEntity<ApiResponse<Void?>> {
        val errorMessage = e.bindingResult.fieldError?.defaultMessage ?: "유효성 검사 실패"
        val response = ApiResponse.fail<Void>("INPUT-400", errorMessage)
        return ResponseEntity.badRequest().body(response)
    }

    //security 권한 관련 예외 처리 핸들러
    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(e: AccessDeniedException): ResponseEntity<ApiResponse<Void?>> {
        log.warn("handleAccessDeniedException", e)
        val response = ApiResponse.fail<Void>("AUTH-403", "접근 권한이 없습니다")
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response)
    }

    // 인증 실패 예외 처리 핸들러 (잘못된 이메일/비밀번호)
    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadCredentialsException(e: BadCredentialsException): ResponseEntity<ApiResponse<Void?>> {
        log.warn("handleBadCredentialsException", e)
        val response = ApiResponse.fail<Void>("AUTH-401", "이메일 또는 비밀번호가 올바르지 않습니다")
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response)
    }

    @ExceptionHandler(ChatException::class)
    fun handleChatException(e: ChatException): ResponseEntity<ApiResponse<Void?>> {
        log.info(e.message, e)
        val response = ApiResponse.fail<Void>(e.code, e.chatErrorCode.message)
        return ResponseEntity.status(e.httpStatus).body(response)
    }

    // 커스텀 예외는 다 이 위로 작성해야 함
    // 그외 모든 예외 처리 핸들러
    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<ApiResponse<Void?>> {
        log.error("handleException", e)
        val response = ApiResponse.fail<Void>("SERVER-500", "서버 내부 오류가 발생하였습니다.")
        return ResponseEntity.status(500).body(response)
    }
}
