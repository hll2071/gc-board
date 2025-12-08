package com.example.gcsuhang.user.controller;

import com.example.gcsuhang.user.service.AuthService;
import com.example.gcsuhang.user.service.request.LoginRequest;
import com.example.gcsuhang.user.service.request.SignupRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/signup")
    public void signup(@RequestBody SignupRequest request) {
        authService.signup(request);
    }

    @PostMapping("/login")
    public void login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        Long userId = authService.login(request);
        HttpSession session = httpRequest.getSession();
        session.setAttribute("userId", userId);
    }

    @PostMapping("/logout")
    public void logout(HttpServletRequest httpRequest) {
        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            session.invalidate();
        }
    }
}
