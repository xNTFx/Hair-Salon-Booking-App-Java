package com.hairdresser.my_spring_project.controller;

import com.hairdresser.my_spring_project.entity.User;
import com.hairdresser.my_spring_project.security.JwtUtil;
import com.hairdresser.my_spring_project.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
public class RefreshController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/auth/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "No cookies found."));
        }

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if ("jwt".equals(cookie.getName())) {
                refreshToken = cookie.getValue();
                break;
            }
        }
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh token missing."));
        }

        // Find user based on refresh token stored in database
        Optional<User> userOptional = authService.findUserByRefreshToken(refreshToken);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "User not found for refresh token."));
        }
        User user = userOptional.get();

        // Validation of token refresh
        try {
            Claims claims = jwtUtil.validateRefreshToken(refreshToken);
            String tokenUsername = claims.get("username", String.class);
            if (!user.getUsername().equals(tokenUsername)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Token data does not match user."));
            }
            // Wygeneruj nowy token dostępu
            String newAccessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getId(), user.getRole());
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", "Invalid refresh token."));
        }
    }
}
