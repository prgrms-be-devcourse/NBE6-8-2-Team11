plugins {
    java
    id("org.springframework.boot") version "3.5.3"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-web")
    //소셜 로그인을 위한 oauth2추가
    implementation("org.springframework.boot:spring-boot-starter-oauth2-client")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("com.h2database:h2")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.springframework.boot:spring-boot-starter-security")
    testImplementation("org.springframework.security:spring-security-test")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    //mySQL connector for JPA
    runtimeOnly("com.mysql:mysql-connector-j")
    // PostgreSQL connector for Railway
    runtimeOnly("org.postgresql:postgresql")
    // Redis
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    // JWT dependencies
    implementation("io.jsonwebtoken:jjwt-api:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.11.5")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.11.5")
    // Spring doc
    implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.8.0")
    // Actuator for health checks and monitoring
    implementation("org.springframework.boot:spring-boot-starter-actuator")

    //lombok 의존성 추가
    testCompileOnly ("org.projectlombok:lombok") // 테스트 의존성 추가
    testAnnotationProcessor ("org.projectlombok:lombok") // 테스트 의존성 추가

    // WebSocket
    implementation ("org.springframework.boot:spring-boot-starter-websocket")
}

tasks.withType<Test> {
    useJUnitPlatform()
}

tasks.withType<JavaCompile> {
    options.compilerArgs.add("-parameters")
}