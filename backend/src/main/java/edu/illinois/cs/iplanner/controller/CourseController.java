package edu.illinois.cs.iplanner.controller;

import java.util.List;
import java.util.Optional;

import javax.naming.directory.SearchResult;

import java.io.IOException;
import java.util.ArrayList;
import java.time.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;
import edu.illinois.cs.iplanner.service.DataLoadService;
import edu.illinois.cs.iplanner.vo.CourseViewVO;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/course")
public class CourseController {
    @Autowired
    CourseDAO courseDAO;

    @Autowired
    DataLoadService dataLoadService;

    @GetMapping("/load-data")
    public List<CourseDTO> loadData() throws Exception {
        dataLoadService.downloadData();
        return dataLoadService.convertJsonObjToCourseDTOs();
    }

    @GetMapping("/reset-data")
    public void deleteData() throws IOException {
        dataLoadService.resetDatabase();
    }
    
    @RequestMapping("/")
    public List<CourseDTO> getAllCourses() {
        //get courses from the most recent 5 years
        Month now = LocalDateTime.now(ZoneId.of("America/Chicago")).getMonth();
        int fiveYearAgo = LocalDateTime.now(ZoneId.of("America/Chicago")).getYear() - 4;
        if (now.compareTo(Month.APRIL) >= 0 && now.compareTo(Month.NOVEMBER) < 0) {
            return getAllCourses(Integer.toString(fiveYearAgo) + "-fa");
        } else {
            if (now.compareTo(Month.NOVEMBER) >= 0) {
                fiveYearAgo++;
            }
            return getAllCourses(Integer.toString(fiveYearAgo) + "-sp");
        }
    }

    @RequestMapping("/{semester}")
    public List<CourseDTO> getAllCourses(@PathVariable(name = "semester") String semester) {
        List<CourseDTO> courses = courseDAO.findAll();
        List<CourseDTO> allCourses = new ArrayList<CourseDTO>();
        for (CourseDTO course : courses) {
            boolean add = false;
            List<String> courseSemester = course.getSemester();
            for (String s : courseSemester) {
                // if courseSemester.year > semester.year
                if (Integer.parseInt(s.substring(0, 4)) > Integer.parseInt(semester.substring(0, 4))) {
                    add = true;
                    break;
                } else if (Integer.parseInt(s.substring(0, 4)) == Integer.parseInt(semester.substring(0, 4))) {
                    if (semester.substring(5, 7).equals("fa")) {
                        if (s.substring(5, 7).equals("sp")) {
                            add = true;
                            break;
                        }
                    }
                }
            }
            if (add) {
                allCourses.add(course);
            }
        }
        return allCourses;
    }

    @RequestMapping("/id/{id}")
    public CourseViewVO getCourseById(@PathVariable(name = "id") String id, HttpServletResponse response) {
        Optional<CourseDTO> course = courseDAO.findById(id);
        if (course.isPresent()) {
            return new CourseViewVO(course.get());
        }
        response.setStatus(400); // Http status code: bad request
        return null;
    }

    // @RequestMapping("/subjects") // Returns a list of all subjects (e.g. CS, Stats, ECE, etc.)
    // public List<String> getAllSubjects() {
    //     List<String> allSubjects = new ArrayList<String>();
    //     List<CourseDTO> courses = courseDAO.findAll();
    //     for (CourseDTO course : courses) {
    //         if (!allSubjects.contains(course.getSubject())){
    //             allSubjects.add(course.getSubject());
    //         }
    //     }
    //     return allSubjects;
    // }

    // @RequestMapping("/subjects/{subject_name}") // Returns a list of courses in "subject_name" category
    // public List<CourseDTO> getCoursesFromSubjectX(@PathVariable(name = "subject_name") String subject_name) {
    //     List<CourseDTO> allCourses = courseDAO.findAll();
    //     allCourses.removeIf(course -> (!course.getSubject().equals(subject_name)));
    //     return allCourses;
    // }

    // @RequestMapping("/subjects/{subject_name}/{number}") // Returns the info of one course (e.g. CS 101: "title: Intro
    //                                                      // Computing: ...", "credit: 3", "prereq: if any", "concur: if
    //                                                      // any", "equiv: if any")
    // public CourseDTO getCourseInfo(@PathVariable(name = "subject_name") String subject_name, @PathVariable(name = "number") String number) {
    //     List<CourseDTO> getDesiredCourse = getCoursesFromSubjectX(subject_name);
    //     getDesiredCourse.removeIf(course->(!course.getNumber().equals(number)));
    //     if (getDesiredCourse.size() == 0) {
    //         return new CourseDTO();
    //     }
    //     return getDesiredCourse.get(0);
    // }

    @GetMapping("/search")
    public CourseViewVO searchCourses(@RequestParam(name = "kw", required = true) String kw, @RequestParam(name = "subject", required = false) String subject) {
        String[] splitkw = kw.split("\\s+");
        CourseDTO searchResult;
        if (subject != null) {
            searchResult = courseDAO.findBySubjectAndNumber(subject, splitkw[1]);
        } else {
            searchResult = courseDAO.findBySubjectAndNumber(splitkw[0], splitkw[1]);
        }
        if (searchResult == null) {
            return null;
        }
        return new CourseViewVO(searchResult);
    }
}
