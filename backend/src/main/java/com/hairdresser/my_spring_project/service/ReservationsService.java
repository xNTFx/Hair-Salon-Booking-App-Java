package com.hairdresser.my_spring_project.service;

import com.hairdresser.my_spring_project.entity.Reservations;
import com.hairdresser.my_spring_project.repository.ReservationsRepository;
import com.hairdresser.my_spring_project.status.ReservationStatus;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationsService {

    private final ReservationsRepository reservationsRepository;

    @Autowired
    public ReservationsService(ReservationsRepository reservationsRepository) {
        this.reservationsRepository = reservationsRepository;
    }

    @Scheduled(fixedRate = 3600000) // every hour
    @Transactional
    public void markReservationsAsCompleted() {
        reservationsRepository.updateCompletedReservations();
    }

    public Reservations getReservationById(Integer reservationId) {
        return reservationsRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with id: " + reservationId));
    }

    public List<Reservations> getAllReservations() {
        return reservationsRepository.findAll();
    }

    public List<Reservations> getAllActiveReservations(String userId) {
        return reservationsRepository.getAllActiveReservations(userId);
    }

    public List<Reservations> getAllHistoryReservations(String userId) {
        return reservationsRepository.getAllHistoryReservations(userId);
    }

    public Reservations cancelReservation(Integer reservationId) {
        Reservations reservation = reservationsRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found with id: " + reservationId));

        reservation.setStatus(ReservationStatus.CANCELLED);
        return reservationsRepository.save(reservation);
    }

    public Reservations saveReservation(Reservations reservation) {
        return reservationsRepository.save(reservation);
    }
}
