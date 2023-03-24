package edu.illinois.cs.iplanner.controller;

import java.util.List;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;
import edu.illinois.cs.iplanner.vo.CourseViewVO;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    CourseDAO courseDAO;

    @RequestMapping("/") // Returns a list of all courses
    public List<CourseViewVO> getAllCourses() {
        List<CourseDTO> courses = courseDAO.findAll();
        List<CourseViewVO> allCourses = new ArrayList<CourseViewVO>();
        for (CourseDTO course : courses) {
            allCourses.add(new CourseViewVO(course));
        }
        return allCourses;
    }

    @RequestMapping("/subjects") // Returns a list of all subjects (e.g. CS, Stats, ECE, etc.)
    public List<String> getAllSubjects() {
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
    public List<CourseDTO> getCoursesFromSubjectX(@PathVariable(name = "subject_name") String subject_name) {
        List<CourseDTO> allCourses = courseDAO.findAll();
        allCourses.removeIf(course -> (!course.getSubject().equals(subject_name)));
        return allCourses;
    }

    @RequestMapping("/subjects/{subject_name}/{number}") // Returns the info of one course (e.g. CS 101: "title: Intro
                                                         // Computing: ...", "credit: 3", "prereq: if any", "concur: if
                                                         // any", "equiv: if any")
    public CourseDTO getCourseInfo(@PathVariable(name = "subject_name") String subject_name, @PathVariable(name = "number") String number) {
        List<CourseDTO> getDesiredCourse = getCoursesFromSubjectX(subject_name);
        getDesiredCourse.removeIf(course->(!course.getNumber().equals(number)));
        return getDesiredCourse.get(0);
    }
}
