package edu.illinois.cs.iplanner;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import edu.illinois.cs.iplanner.controller.CourseController;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;
import edu.illinois.cs.iplanner.vo.CourseViewVO;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
public class CourseControllerTests {
    @Autowired
    CourseController courseController;

    @Autowired
    CourseDAO courseDAO;

    @Test
    void testGetAllCourses() {
        List<CourseViewVO> allCourses = new ArrayList<CourseViewVO>();
        CourseDTO courseDTO = new CourseDTO();
        List<CourseViewVO> allCoursesTest = courseController.getAllCourses();

        // Appending "CS 233"
        List<List<String>> prereq1 = new ArrayList<List<String>>();
        List<List<String>> concur1 = new ArrayList<List<String>>();
        List<String> equiv1 = new ArrayList<String>();
        prereq1.add(Arrays.asList("CS 125", "CS 126"));
        prereq1.add(Arrays.asList("CS 173", "MATH 213"));
        concur1.add(Arrays.asList("CS 225"));
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c532", "CS", "233", "Computer Architecture", 4, prereq1, concur1, equiv1);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "CS 233"

        // Appending "CS 341"
        List<List<String>> prereq2 = new ArrayList<List<String>>();
        List<List<String>> concur2 = new ArrayList<List<String>>();
        List<String> equiv2 = new ArrayList<String>();
        prereq2.add(Arrays.asList("CS 225"));
        prereq2.add(Arrays.asList("CS 233"));
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c533", "CS", "341", "System Programming", 4, prereq2, concur2, equiv2);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "CS 341"

        // Appending "ECE 374"
        List<List<String>> prereq3 = new ArrayList<List<String>>();
        List<List<String>> concur3 = new ArrayList<List<String>>();
        List<String> equiv3 = new ArrayList<String>();
        prereq3.add(Arrays.asList("CS 173", "MATH 213"));
        prereq3.add(Arrays.asList("CS 225"));
        equiv3.add("CS 374");
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c534", "ECE", "374", "Introduction to Algorithms & Models of Computation", 4, prereq3, concur3, equiv3);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "ECE 374"

        // Appending "ECE 385"
        List<List<String>> prereq4 = new ArrayList<List<String>>();
        List<List<String>> concur4 = new ArrayList<List<String>>();
        List<String> equiv4 = new ArrayList<String>();
        prereq4.add(Arrays.asList("ECE 110"));
        prereq4.add(Arrays.asList("ECE 220"));
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c535", "ECE", "385", "Digital Systems Laboratory", 3, prereq4, concur4, equiv4);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "ECE 385"

        // Appending "MATH 357"
        List<List<String>> prereq5 = new ArrayList<List<String>>();
        List<List<String>> concur5 = new ArrayList<List<String>>();
        List<String> equiv5 = new ArrayList<String>();
        prereq5.add(Arrays.asList("CS 101", "CS 105", "CS 124", "CS 125", "ECE 220"));
        prereq5.add(Arrays.asList("MATH 241"));
        prereq5.add(Arrays.asList("MATH 225", "MATH 257", "MATH 415", "MATH 415", "ASRM 406", "BIOE 210"));
        equiv5.add("CS 357");
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c536", "MATH", "357", "Numerical Methods I", 3, prereq5, concur5, equiv5);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "MATH 357"

        // Appending "MATH 241"
        List<List<String>> prereq6 = new ArrayList<List<String>>();
        List<List<String>> concur6 = new ArrayList<List<String>>();
        List<String> equiv6 = new ArrayList<String>();
        prereq6.add(Arrays.asList("MATH 231"));
        courseDTO = new CourseDTO("6407d6c40f45cd3dddf4c537", "MATH", "241", "Calculus III", 4, prereq6, concur6, equiv6);
        allCourses.add(new CourseViewVO(courseDTO));
        // Done appending "MATH 241"
        assertEquals(allCourses, allCoursesTest);
    }

    @Test
    void testGetSubjects() {
        List<String> subjects = new ArrayList<String>();
        subjects.add("CS");
        subjects.add("ECE");
        subjects.add("MATH");
        List<String> subjectsTest = courseController.getAllSubjects();
        assertEquals(subjects, subjectsTest);
    }

    @Test
    void testGetCourses() {
        List<CourseDTO> allCourses = new ArrayList<CourseDTO>();
        List<CourseDTO> allCoursesTest = new ArrayList<CourseDTO>();
  
        // Testing "CS" courses
        List<List<String>> prereq1 = new ArrayList<List<String>>();
        List<List<String>> concur1 = new ArrayList<List<String>>();
        List<String> equiv1 = new ArrayList<String>();
        prereq1.add(Arrays.asList("CS 125", "CS 126"));
        prereq1.add(Arrays.asList("CS 173", "MATH 213"));
        concur1.add(Arrays.asList("CS 225"));
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c532", "CS", "233", "Computer Architecture", 4, prereq1, concur1, equiv1));
        
        List<List<String>> prereq2 = new ArrayList<List<String>>();
        List<List<String>> concur2 = new ArrayList<List<String>>();
        List<String> equiv2 = new ArrayList<String>();
        prereq2.add(Arrays.asList("CS 225"));
        prereq2.add(Arrays.asList("CS 233"));
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c533", "CS", "341", "System Programming", 4, prereq2, concur2, equiv2));
        allCoursesTest = courseController.getCoursesFromSubjectX("CS");
        assertEquals(allCourses, allCoursesTest);
        allCourses.clear();
        // Done Testing "CS" courses

        // Testing "ECE" courses
        List<List<String>> prereq3 = new ArrayList<List<String>>();
        List<List<String>> concur3 = new ArrayList<List<String>>();
        List<String> equiv3 = new ArrayList<String>();
        prereq3.add(Arrays.asList("CS 173", "MATH 213"));
        prereq3.add(Arrays.asList("CS 225"));
        equiv3.add("CS 374");
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c534", "ECE", "374", "Introduction to Algorithms & Models of Computation", 4, prereq3, concur3, equiv3));
        List<List<String>> prereq4 = new ArrayList<List<String>>();
        List<List<String>> concur4 = new ArrayList<List<String>>();
        List<String> equiv4 = new ArrayList<String>();
        prereq4.add(Arrays.asList("ECE 110"));
        prereq4.add(Arrays.asList("ECE 220"));
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c535", "ECE", "385", "Digital Systems Laboratory", 3, prereq4, concur4, equiv4));
        allCoursesTest = courseController.getCoursesFromSubjectX("ECE");
        assertEquals(allCourses, allCoursesTest);
        allCourses.clear();
        // Done Testing "ECE" courses

        // Testing "MATH" courses
        List<List<String>> prereq5 = new ArrayList<List<String>>();
        List<List<String>> concur5 = new ArrayList<List<String>>();
        List<String> equiv5 = new ArrayList<String>();
        prereq5.add(Arrays.asList("CS 101", "CS 105", "CS 124", "CS 125", "ECE 220"));
        prereq5.add(Arrays.asList("MATH 241"));
        prereq5.add(Arrays.asList("MATH 225", "MATH 257", "MATH 415", "MATH 415", "ASRM 406", "BIOE 210"));
        equiv5.add("CS 357");
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c536", "MATH", "357", "Numerical Methods I", 3, prereq5, concur5, equiv5));
        List<List<String>> prereq6 = new ArrayList<List<String>>();
        List<List<String>> concur6 = new ArrayList<List<String>>();
        List<String> equiv6 = new ArrayList<String>();
        prereq6.add(Arrays.asList("MATH 231"));
        allCourses.add(new CourseDTO("6407d6c40f45cd3dddf4c537", "MATH", "241", "Calculus III", 4, prereq6, concur6, equiv6));
        allCoursesTest = courseController.getCoursesFromSubjectX("MATH");
        assertEquals(allCourses, allCoursesTest);
        allCourses.clear();
        // Done Testing "MATH" courses   
    }

    @Test
    void testGetCourseInfo() {
        CourseDTO courseInfo = new CourseDTO();
        CourseDTO courseInfoTest = new CourseDTO();
        List<List<String>> prereq = new ArrayList<List<String>>();
        List<List<String>> concur = new ArrayList<List<String>>();
        List<String> equiv = new ArrayList<String>();

        prereq.clear();
        concur.clear();
        equiv.clear();
        // Testing course "CS 233"
        prereq.add(Arrays.asList("CS 125", "CS 126"));
        prereq.add(Arrays.asList("CS 173", "MATH 213"));
        concur.add(Arrays.asList("CS 225"));
        courseInfo = new CourseDTO("6407d6c40f45cd3dddf4c532", "CS", "233", "Computer Architecture", 4, prereq, concur, equiv);
        courseInfoTest = courseController.getCourseInfo("CS", "233");
        assertEquals(courseInfo, courseInfoTest);
        prereq.clear();
        concur.clear();
        equiv.clear();
        // Done Testing course "CS 233"

        // Testing course "CS 341"
        prereq.add(Arrays.asList("CS 225"));
        prereq.add(Arrays.asList("CS 233"));
        courseInfo =  new CourseDTO("6407d6c40f45cd3dddf4c533", "CS", "341", "System Programming", 4, prereq, concur, equiv);
        courseInfoTest = courseController.getCourseInfo("CS", "341");
        assertEquals(courseInfo, courseInfoTest);
        prereq.clear();
        concur.clear();
        equiv.clear();
        // Done Testing course "CS 341"

        // Testing course "ECE 374"
        prereq.add(Arrays.asList("CS 173", "MATH 213"));
        prereq.add(Arrays.asList("CS 225"));
        equiv.add("CS 374");
        courseInfo = new CourseDTO("6407d6c40f45cd3dddf4c534", "ECE", "374", "Introduction to Algorithms & Models of Computation", 4, prereq, concur, equiv);
        courseInfoTest = courseController.getCourseInfo("ECE", "374");
        assertEquals(courseInfo, courseInfoTest);
        prereq.clear();
        concur.clear();
        equiv.clear();
        // Don Testing course "ECE 374"
    }
}
