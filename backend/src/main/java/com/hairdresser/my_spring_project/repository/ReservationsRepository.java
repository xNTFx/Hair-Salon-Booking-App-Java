package com.hairdresser.my_spring_project.repository;

import com.hairdresser.my_spring_project.entity.Reservations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationsRepository extends JpaRepository<Reservations, Integer> {

    @Query("SELECT r FROM Reservations r " +
            "JOIN FETCH r.service s " +
            "JOIN FETCH r.employee e " +
            "WHERE r.userId = :userId AND r.status = 'PENDING'")
    List<Reservations> getAllActiveReservations(@Param("userId") String userId);

    @Query("SELECT r FROM Reservations r " +
            "JOIN FETCH r.service s " +
            "JOIN FETCH r.employee e " +
            "WHERE r.userId = :userId AND (r.status = 'CANCELLED' OR r.status = 'COMPLETED')")
    List<Reservations> getAllHistoryReservations(@Param("userId") String userId);

    @Modifying
    @Query("UPDATE Reservations r SET r.status = 'COMPLETED' " +
            "WHERE r.status = 'PENDING' AND r.reservationDate <= CURRENT_DATE " +
            "AND r.endTime < CURRENT_TIME")
    void updateCompletedReservations();
}
