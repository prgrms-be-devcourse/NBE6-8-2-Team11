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

@RestControllerAdvice
class GlobalExceptionHandler {
    
    companion object {
        private val log = LoggerFactory.getLogger(GlobalExceptionHandler::class.java)
    }

    @ExceptionHandler(CustomException::class)
    fun handleCustomException(e: CustomException): ResponseEntity<ApiResponse<Void?>> {
        log.info(e.message, e)
        val response = ApiResponse.fail<Void>(e.code, e.errorCode.message)
        return ResponseEntity.status(e.httpStatus).body(response)
    }

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

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidationException(e: MethodArgumentNotValidException): ResponseEntity<ApiResponse<Void?>> {
        val errorMessage = e.bindingResult.fieldError?.defaultMessage ?: "유효성 검사 실패"
        val response = ApiResponse.fail<Void>("INPUT-400", errorMessage)
        return ResponseEntity.badRequest().body(response)
    }

    @ExceptionHandler(AccessDeniedException::class)
    fun handleAccessDeniedException(e: AccessDeniedException): ResponseEntity<ApiResponse<Void?>> {
        log.warn("handleAccessDeniedException", e)
        val response = ApiResponse.fail<Void>("AUTH-403", "접근 권한이 없습니다")
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response)
    }

    // [수정!] 로그인 실패 시 친절한 메시지 반환
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

    @ExceptionHandler(Exception::class)
    fun handleException(e: Exception): ResponseEntity<ApiResponse<Void?>> {
        log.error("handleException", e)
        val response = ApiResponse.fail<Void>("SERVER-500", "서버 내부 오류가 발생하였습니다.")
        return ResponseEntity.status(500).body(response)
    }
}