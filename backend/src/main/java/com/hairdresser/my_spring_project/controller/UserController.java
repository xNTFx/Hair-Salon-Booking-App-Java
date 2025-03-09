package com.hairdresser.my_spring_project.controller;

import com.hairdresser.my_spring_project.entity.User;
import com.hairdresser.my_spring_project.repository.UserRepository;
import com.hairdresser.my_spring_project.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Authorization header missing or invalid"));
        }
        String token = authHeader.substring(7);
        try {
            Claims claims = jwtUtil.validateAccessToken(token);
            String username = claims.get("username", String.class);
            User user = userRepository.findByUsername(username).orElse(null);
            if(user == null) {
                return ResponseEntity.status(404).body(Map.of("message", "User not found"));
            }
            return ResponseEntity.ok(Map.of(
                    "id", user.getId(),
                    "username", user.getUsername(),
                    "role", user.getRole()
            ));
        } catch (JwtException e) {
            return ResponseEntity.status(403).body(Map.of("message", "Invalid or expired token"));
        }
    }
}
