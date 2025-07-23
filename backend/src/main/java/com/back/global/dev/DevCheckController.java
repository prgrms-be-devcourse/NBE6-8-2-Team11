package com.back.global.dev;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


// 개발용 컨트롤러
// 서버가 정상 동작하는지 확인만 합니다.
@Hidden // swagger에 노출 안되도록
@RestController
public class DevCheckController {

    @GetMapping("/dev-check")
    public String devCheck() {
        return "Success Dev Check";
    }
}
