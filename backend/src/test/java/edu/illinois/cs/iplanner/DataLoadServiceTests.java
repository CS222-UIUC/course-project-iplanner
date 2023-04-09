package edu.illinois.cs.iplanner;

import java.io.IOException;
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

}