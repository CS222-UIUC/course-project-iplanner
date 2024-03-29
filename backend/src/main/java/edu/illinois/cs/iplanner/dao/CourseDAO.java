package edu.illinois.cs.iplanner.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import edu.illinois.cs.iplanner.model.CourseDTO;

public interface CourseDAO extends MongoRepository<CourseDTO, String> {
    List<CourseDTO> findAll();
    CourseDTO findBySubjectAndNumber(String subject, String number);
}
