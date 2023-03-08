package edu.illinois.cs.iplanner.controller;

import java.util.List;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
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

    @RequestMapping("/")
    List<CourseDTO> findAllCourses() {
        return courseDAO.findAll();
    }
    @RequestMapping("/subjects")                            // Returns a list of subjects (e.g. CS, Stats, ECE, etc.)
    List<String> getSubjects() {
        List<String> allSubjects = new List<String>();      // ????
        List<CourseDTO> courses = courseDAO.findAll();
        for (CourseDTO course : courses) {
            allSubjects.add(course.getSubject());
        }
        return allSubjects;
    }

    @RequestMapping("/subjects/{subject_name}")           // Returns a list of courses in "subject_name" category
    List<CourseDTO> getCourses(@PathVariable(name = "subject_name") String subject_name) throws IOException {
        List<CourseDTO> allCourses = courseDAO.findAll();
        allCourses.removeIf(course -> (course.getSubject() != subject_name));
        return allCourses;
    }
    @RequestMapping("/subjects/{subject_name}/{number}")       // Returns the info of one course (e.g. CS 101: "title: Intro Computing: ...", "credit: 3", "prereq: if any", "concur: if any", "equiv: if any")
    String getCourseInfo(@PathVariable(name = "subject_name") String subject_name, @PathVariable(name = "number") String number) throws IOException {
        List<CourseDTO> allCourses = getCourses(subject_name);
        CourseDTO desiredCourse = new CourseDTO();
        for (CourseDTO course : allCourses) {
            if (course.getNumber() == number) desiredCourse = course;
        }
        String course_info = "Course: " + desiredCourse.getSubject() + " " + desiredCourse.getNumber() + ": " + desiredCourse.getTitle() + "\n" + "Credit: " + desiredCourse.getCredit().toString() + "\n";
        if (desiredCourse.getPrereq().size() != 0) {
            List<List<String>> prereqs = desiredCourse.getPrereq();
            course_info = course_info + "Prerequisit(s): " + "\n"; 
            for (List<String> prereq : prereqs) {
                course_info = course_info + "   " + "One of the following: " + "\n";
                for (String courses : prereq) {
                    course_info = course_info + "     " + courses + " ";
                }
                course_info += "\n";
            }

        }
        if (desiredCourse.getConcur().size() != 0) {               // Concur should be a 1-d list?

        }
        if (desiredCourse.getEquiv().size() != 0) {
            course_info += "Equivalent to: ";
            for (String courses : desiredCourse.getEquiv()) {
                course_info += courses + " ";
            }
            course_info += "\n";
        }
        return course_info;
    }
    @RequestMapping("/search")                                  // Returns a list of courses that users intend to search
    @ResponseBody
    public List<CourseDTO> searchforcourse(@RequestParam(value = "search", required = false) String searchString) {
        // TODO:
        return new List<CourseDTO>();
    }
}
