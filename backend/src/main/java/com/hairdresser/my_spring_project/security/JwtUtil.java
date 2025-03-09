package com.hairdresser.my_spring_project.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${jwt.access-token-secret}")
    private String accessTokenSecret;

    @Value("${jwt.refresh-token-secret}")
    private String refreshTokenSecret;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration;

    public String generateAccessToken(String username, UUID id, String role) {
        return Jwts.builder()
                .claim("username", username)
                .claim("id", id.toString())
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(SignatureAlgorithm.HS256, accessTokenSecret)
                .compact();
    }

    public String generateRefreshToken(String username, UUID id, String role) {
        return Jwts.builder()
                .claim("username", username)
                .claim("id", id.toString())
                .claim("role", role)
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(SignatureAlgorithm.HS256, refreshTokenSecret)
                .compact();
    }

    public Claims validateAccessToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(accessTokenSecret)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.out.println("JWT Error: " + e.getMessage());
            throw new IllegalArgumentException("Invalid JWT token");
        }
    }

    public Claims validateRefreshToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(refreshTokenSecret)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (JwtException e) {
            System.out.println("JWT Refresh Error: " + e.getMessage());
            throw new IllegalArgumentException("Invalid Refresh token");
        }
    }
}
