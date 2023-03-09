package edu.illinois.cs.iplanner.controller;

import java.util.List;
import java.util.ArrayList;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    CourseDAO courseDAO;

    @RequestMapping("/") // Returns a list of all courses
    List<CourseDTO> findAllCourses() {
        return courseDAO.findAll();
    }

    @RequestMapping("/subjects") // Returns a list of all subjects (e.g. CS, Stats, ECE, etc.)
    List<String> getSubjects() {
        List<String> allSubjects = new ArrayList<String>();
        List<CourseDTO> courses = courseDAO.findAll();
        for (CourseDTO course : courses) {
            if (!allSubjects.contains(course.getSubject())){
                allSubjects.add(course.getSubject());
            }
        }
        return allSubjects;
    }

    @RequestMapping("/subjects/{subject_name}") // Returns a list of courses in "subject_name" category
    List<CourseDTO> getCourses(@PathVariable(name = "subject_name") String subject_name) throws IOException {
        List<CourseDTO> allCourses = courseDAO.findAll();
        allCourses.removeIf(course -> (!course.getSubject().equals(subject_name)));
        return allCourses;
    }

    @RequestMapping("/subjects/{subject_name}/{number}") // Returns the info of one course (e.g. CS 101: "title: Intro
                                                         // Computing: ...", "credit: 3", "prereq: if any", "concur: if
                                                         // any", "equiv: if any")
    CourseDTO getCourseInfo(@PathVariable(name = "subject_name") String subject_name, @PathVariable(name = "number") String number) throws IOException {
        List<CourseDTO> getDesiredCourse = getCourses(subject_name);
        getDesiredCourse.removeIf(course->(!course.getNumber().equals(number)));
        return getDesiredCourse.get(0);
    }

    @RequestMapping("/search") // Returns a list of courses that users intend to search
    @ResponseBody
    public List<CourseDTO> searchforcourse(@RequestParam(value = "search", required = false) String searchString) {
        // TODO:
        return new ArrayList<CourseDTO>();
    }
}
