package com.back.global.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

/**
 * Docker 헬스체크용 간단한 컨트롤러
 * GlobalExceptionHandler의 영향을 받지 않는 별도 엔드포인트
 */
@CrossOrigin(origins = {
        "http://localhost:3000",              // 로컬 개발
        "https://*.vercel.app",               // Vercel 배포 도메인
        "https://vercel.app"                  // Vercel 기본 도메인
})
@RestController
public class HealthCheckController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // 애플리케이션 상태
            health.put("status", "UP");
            health.put("timestamp", System.currentTimeMillis());
            
            // 데이터베이스 연결 확인
            try (Connection connection = dataSource.getConnection()) {
                health.put("database", "UP");
            } catch (Exception e) {
                health.put("database", "DOWN");
                health.put("database_error", e.getMessage());
                health.put("status", "DOWN");
            }
            
            // JVM 메모리 정보
            Runtime runtime = Runtime.getRuntime();
            Map<String, Object> memory = new HashMap<>();
            memory.put("total", runtime.totalMemory());
            memory.put("free", runtime.freeMemory());
            memory.put("used", runtime.totalMemory() - runtime.freeMemory());
            memory.put("max", runtime.maxMemory());
            health.put("memory", memory);
            
            return ResponseEntity.ok(health);
            
        } catch (Exception e) {
            health.put("status", "DOWN");
            health.put("error", e.getMessage());
            return ResponseEntity.status(503).body(health);
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Server is running");
        return ResponseEntity.ok(response);
    }
}