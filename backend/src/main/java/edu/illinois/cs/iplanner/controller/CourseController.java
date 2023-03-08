package edu.illinois.cs.iplanner.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    CourseDAO courseDAO;

    // @RequestMapping("/")
    // List<CourseDTO> findAllCourses() {
    //     return courseDAO.findAll();
    // }
    @RequestMapping("/subjects")                            // Returns a list of subjects (e.g. CS, Stats, ECE, etc.)

    @RequestMapping("/subjects/Computer_Science")           // Returns a list of courses in "Computer Science Category"

    @RequestMapping("/subjects/Computer_Science/101")       // Returns the info of the course (e.g. CS 101: "title: Intro Computing: ...", "credit: 3", "prereq: if any", "concur: if any", "equiv: if any")

    @RequestMapping("/search")                                  // Returns a list of courses that users intend to search
    @ResponseBody
    public List<CourseDTO> searchforcourse()
}
