package com.hairdresser.my_spring_project.controller;

import com.hairdresser.my_spring_project.entity.AvailableHours;
import com.hairdresser.my_spring_project.service.AvailableHoursService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/available_hours")
public class AvailableHoursController {

    private final AvailableHoursService availableHoursService;

    @Autowired
    public AvailableHoursController(AvailableHoursService availableHoursService) {
        this.availableHoursService = availableHoursService;
    }

    @GetMapping
    public List<AvailableHours> getAllEmployees() {
        return availableHoursService.getAllEmployees();
    }

    @GetMapping("/employee/{employeeId}/reservation_date/{reservation_date}/duration/{duration}")
    public List<AvailableHours> getAvailableHoursByEmployeeId(@PathVariable int employeeId, @PathVariable LocalDate reservation_date, @PathVariable String duration) {
        return availableHoursService.getAvailableHoursByEmployeeId(employeeId, reservation_date, duration);
    }

}
