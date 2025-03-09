package com.hairdresser.my_spring_project.service;

import com.hairdresser.my_spring_project.entity.AvailableHours;
import com.hairdresser.my_spring_project.repository.AvailableHoursRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AvailableHoursService {

    private final AvailableHoursRepository availableHoursRepository;

    @Autowired
    public AvailableHoursService(AvailableHoursRepository availableHoursRepository) {
        this.availableHoursRepository = availableHoursRepository;
    }

    public List<AvailableHours> getAllEmployees() {
        return availableHoursRepository.findAll();
    }

    public List<AvailableHours> getAvailableHoursByEmployeeId(int employeeId, LocalDate reservation_date, String duration) {
        return availableHoursRepository.findAvailableHoursByEmployeeId(employeeId, reservation_date, duration);
    }
}
