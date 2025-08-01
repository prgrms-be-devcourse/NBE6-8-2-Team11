# Multi-stage build for optimized image size
FROM eclipse-temurin:21-jdk-alpine as builder

WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew ./
COPY gradle ./gradle/
COPY build.gradle.kts ./
COPY settings.gradle.kts ./

# Copy source code
COPY src ./src/

# Make gradlew executable and build
RUN chmod +x gradlew && ./gradlew build -x test --no-daemon

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy built jar from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port
EXPOSE 10000

# Set render profile for Render deployment
ENV SPRING_PROFILES_ACTIVE=render
ENTRYPOINT ["java", "-Dserver.port=${PORT:-10000}", "-jar", "app.jar"]
