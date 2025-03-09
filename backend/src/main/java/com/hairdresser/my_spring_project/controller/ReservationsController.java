package com.hairdresser.my_spring_project.controller;

import com.hairdresser.my_spring_project.entity.Reservations;
import com.hairdresser.my_spring_project.service.ReservationsService;
import com.hairdresser.my_spring_project.security.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/reservations")
public class ReservationsController {

    private final ReservationsService reservationsService;
    private final JwtUtil jwtUtil;

    @Autowired
    public ReservationsController(ReservationsService reservationsService, JwtUtil jwtUtil) {
        this.reservationsService = reservationsService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Reservations> getAllReservations() {
        return reservationsService.getAllReservations();
    }

    @GetMapping("/active")
    public List<Reservations> getAllActiveReservations(@RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        return reservationsService.getAllActiveReservations(userId);
    }

    @GetMapping("/history")
    public List<Reservations> getAllHistoryReservations(@RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        return reservationsService.getAllHistoryReservations(userId);
    }

    @PutMapping("/cancel/{id}")
    public Reservations cancelReservation(@RequestHeader("Authorization") String token, @PathVariable Integer id) {
        String userId = getUserIdFromToken(token);
        Reservations reservation = reservationsService.getReservationById(id);

        if (!reservation.getUserId().equals(userId)) {
            throw new IllegalArgumentException("User is not authorized to cancel this reservation.");
        }

        return reservationsService.cancelReservation(id);
    }

    @PostMapping("/createWithAuth")
    public Reservations createReservationWithAuth(@RequestBody Reservations reservation, @RequestHeader("Authorization") String token) {
        String userId = getUserIdFromToken(token);
        reservation.setUserId(userId);
        return reservationsService.saveReservation(reservation);
    }

    @PostMapping("/createWithoutAuth")
    public Reservations createReservationWithoutAuth(@RequestBody Reservations reservation) {
        reservation.setUserId("0"); // anonymous user
        return reservationsService.saveReservation(reservation);
    }

    private String getUserIdFromToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid token");
        }

        Claims claims = jwtUtil.validateAccessToken(token.replace("Bearer ", ""));
        return claims.get("id", String.class);
    }
}
