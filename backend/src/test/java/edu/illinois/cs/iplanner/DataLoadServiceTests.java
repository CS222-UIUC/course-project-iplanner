package edu.illinois.cs.iplanner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import static org.junit.jupiter.api.Assertions.assertEquals;
import edu.illinois.cs.iplanner.model.CourseDTO;
import edu.illinois.cs.iplanner.service.DataLoadService;

@ExtendWith(SpringExtension.class)
@SpringBootTest
public class DataLoadServiceTests {

    @Autowired
    private DataLoadService dataLoadService;

    @BeforeEach
    public void setUp() throws StreamReadException, DatabindException, IOException {
        dataLoadService.resetDatabase();
    }

    @Test
    public void testConvertJsonObjToCourseDTOs() throws Exception {
        dataLoadService.dowloadData();
        List<CourseDTO> courses = dataLoadService.convertJsonObjToCourseDTOs();
        assertEquals(4444, courses.size());

        CourseDTO course1 = courses.get(0);
        assertEquals("CPSC", course1.getSubject());
        assertEquals("113", course1.getNumber());
        assertEquals("Environment, Agriculture, and Society", course1.getTitle());
        assertEquals(3, course1.getCredit().get(0).intValue());
        assertEquals(0, course1.getPrereq().size());
        assertEquals(0,course1.getConcur().size());
        assertEquals(0,course1.getEquiv().size());
        assertEquals(0,course1.getSubseq().size());

        CourseDTO course2 = courses.get(1);
        assertEquals("SPAN", course2.getSubject());
        assertEquals("142", course2.getNumber());
        assertEquals("Spanish in the Professions", course2.getTitle());
        assertEquals(4, course2.getCredit().get(0).intValue());
        assertEquals(1,course2.getPrereq().size());
        assertEquals(0,course2.getConcur().size());
        assertEquals(2, course2.getEquiv().size());
        assertEquals(17, course2.getSubseq().size());

        CourseDTO course3 = courses.get(2);
        assertEquals("LLS", course3.getSubject());
        assertEquals("201", course3.getNumber());
        assertEquals("US Racial &amp; Ethnic Politics", course3.getTitle());
        assertEquals(3, course3.getCredit().get(0).intValue());
        assertEquals(0,course3.getPrereq().size());
        assertEquals(0,course3.getConcur().size());
        assertEquals(0,course3.getEquiv().size());
        assertEquals(0, course3.getSubseq().size());

        CourseDTO course4 = courses.get(49);
        assertEquals("CS", course4.getSubject());
        assertEquals("233", course4.getNumber());
        assertEquals("Computer Architecture", course4.getTitle());
        assertEquals(4, course4.getCredit().get(0).intValue());
        assertEquals(2,course4.getPrereq().size());
        assertEquals(1,course4.getConcur().size());
        assertEquals(0,course4.getEquiv().size());
        assertEquals(19, course4.getSubseq().size());


    }

    @Test
    public void testSemPatternDetec() throws Exception {
        CourseDTO course1 = new CourseDTO();
        List<String> semester1 = new ArrayList<>();
        semester1.add("2019-fa");
        semester1.add("2020-sp");
        semester1.add("2021-sp");
        semester1.add("2022-sp");
        semester1.add("2023-sp");
        course1.setSemester(semester1);
        String pattern1 = dataLoadService.semPatternDetec(course1.getSemester());
        assertEquals("sp_only", pattern1);

        CourseDTO course2 = new CourseDTO();
        List<String> semester2 = new ArrayList<>();
        semester2.add("2019-fa");
        semester2.add("2020-sp");
        semester2.add("2021-fa");
        semester2.add("2022-fa");
        semester2.add("2023-fa");
        course2.setSemester(semester2);
        String pattern2 = dataLoadService.semPatternDetec(course2.getSemester());
        assertEquals("fa_only", pattern2);

        CourseDTO course3 = new CourseDTO();
        List<String> semester3 = new ArrayList<>();
        semester3.add("2016-fa");
        semester3.add("2016-sp");
        semester3.add("2017-fa");
        semester3.add("2018-fa");
        course3.setSemester(semester3);
        String pattern3 = dataLoadService.semPatternDetec(course3.getSemester());
        assertEquals("not_recent", pattern3);

        CourseDTO course4 = new CourseDTO();
        List<String> semester4 = new ArrayList<>();
        semester4.add("2021-fa");
        semester4.add("2022-sp");
        semester4.add("2022-fa");
        semester4.add("2023-fa");
        semester4.add("2023-sp");
        course4.setSemester(semester4);
        String pattern4 = dataLoadService.semPatternDetec(course4.getSemester());
        assertEquals("none", pattern4);
    }

}