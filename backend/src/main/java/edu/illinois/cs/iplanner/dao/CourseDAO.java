package edu.illinois.cs.iplanner.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.illinois.cs.iplanner.model.CourseDTO;

@Repository
public interface CourseDAO extends JpaRepository<CourseDTO, Integer> {
    List<CourseDTO> findAll();
}
