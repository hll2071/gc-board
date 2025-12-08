package com.example.gcsuhang.user.service;

import com.example.gcsuhang.global.exception.BusinessException;
import com.example.gcsuhang.global.exception.ErrorCode;
import com.example.gcsuhang.user.entity.User;
import com.example.gcsuhang.user.repository.UserRepository;
import com.example.gcsuhang.user.service.request.LoginRequest;
import com.example.gcsuhang.user.service.request.SignupRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;

    @Transactional
    public void signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST); // In real app, use specific DUPLICATE_EMAIL error
        }
        userRepository.save(User.create(request.getEmail(), request.getPassword(), request.getNickname()));
    }

    public Long login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_REQUEST)); // User not found

        if (!user.getPassword().equals(request.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_REQUEST); // Wrong password
        }
        return user.getId();
    }
}
