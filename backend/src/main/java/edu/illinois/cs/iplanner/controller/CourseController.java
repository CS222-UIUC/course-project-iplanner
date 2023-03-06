package edu.illinois.cs.iplanner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    CourseDAO courseDAO;

    @RequestMapping("/")
    public List<CourseDTO> findAllCourses() {
        return courseDAO.findAll();
    }
}
