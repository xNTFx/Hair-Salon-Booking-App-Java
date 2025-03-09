package com.hairdresser.my_spring_project.repository;

import com.hairdresser.my_spring_project.entity.Services;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServicesRepository extends JpaRepository<Services, Integer> {
}