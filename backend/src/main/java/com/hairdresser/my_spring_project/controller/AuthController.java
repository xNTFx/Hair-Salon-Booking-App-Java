package com.hairdresser.my_spring_project.controller;

import com.hairdresser.my_spring_project.entity.User;
import com.hairdresser.my_spring_project.security.JwtUtil;
import com.hairdresser.my_spring_project.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest, HttpServletResponse response) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username and password are required."));
        }

        Optional<User> userOptional = authService.findUserByUsername(username);
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        User user = userOptional.get();

        // Correct password comparison - checks if the given password matches the hashed password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid credentials"));
        }

        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername(), user.getId(), user.getRole());
        authService.updateRefreshToken(user.getId(), refreshToken);

        ResponseCookie cookie = ResponseCookie.from("jwt", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getId(), user.getRole());

        return ResponseEntity.ok(Map.of(
                "user", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "role", user.getRole()
                ),
                "accessToken", accessToken
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest, HttpServletResponse response) {
        String username = registerRequest.get("username");
        String password = registerRequest.get("password");

        if (username == null || password == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username and password are required."));
        }

        // Checking if the username already exists
        if (authService.checkDuplicateUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Username already exists."));
        }

        // Creates a new user (assume the default role “user”)
        User user = authService.createUser(username, password, "user");

        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername(), user.getId(), user.getRole());
        authService.updateRefreshToken(user.getId(), refreshToken);

        ResponseCookie cookie = ResponseCookie.from("jwt", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(7 * 24 * 60 * 60)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        // Generate an access token.
        String accessToken = jwtUtil.generateAccessToken(user.getUsername(), user.getId(), user.getRole());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "user", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "role", user.getRole()
                        ),
                        "accessToken", accessToken
                ));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response, HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("jwt".equals(cookie.getName())) {
                    // Search for the user in the database by refreshToken
                    Optional<User> userOptional = authService.findUserByRefreshToken(cookie.getValue());
                    userOptional.ifPresent(user -> authService.clearRefreshToken(user.getId()));
                }
            }
        }

        ResponseCookie clearedCookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", clearedCookie.toString());

        return ResponseEntity.noContent().build();
    }


}
