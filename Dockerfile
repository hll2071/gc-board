# 1. Build Stage
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY . .
# Skip tests to speed up build
RUN ./gradlew clean bootJar -x test

# 2. Run Stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
