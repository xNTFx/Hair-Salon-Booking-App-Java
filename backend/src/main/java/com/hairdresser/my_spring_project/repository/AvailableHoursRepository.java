package com.hairdresser.my_spring_project.repository;

import com.hairdresser.my_spring_project.entity.AvailableHours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AvailableHoursRepository extends JpaRepository<AvailableHours, Integer> {

    @Query(value = "SELECT DISTINCT ON (ah.start_time, ah.end_time) ah.id, ah.start_time, ah.end_time, ah.employee_id " +
            "FROM available_hours ah " +
            "LEFT JOIN reservations r " +
            "ON r.employee_id = ah.employee_id " +
            "AND (r.start_time + CAST(:duration AS INTERVAL) > ah.end_time) " +
            "AND r.reservation_date = :reservation_date " +
            "WHERE r.start_time IS NULL " +
            "AND (:employeeId = 0 OR ah.employee_id = :employeeId) " +
            "AND (:reservation_date > CURRENT_DATE " +
            "     OR (ah.start_time > (CURRENT_TIME + INTERVAL '1 hour') AND :reservation_date = CURRENT_DATE)) " +
            "ORDER BY ah.start_time, ah.end_time, ah.employee_id ASC",
            nativeQuery = true)
    List<AvailableHours> findAvailableHoursByEmployeeId(
            @Param("employeeId") int employeeId,
            @Param("reservation_date") LocalDate reservationDate,
            @Param("duration") String duration);
}
