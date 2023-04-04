package edu.illinois.cs.iplanner.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Queue;
import java.util.Set;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.bson.types.ObjectId;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;

@Component
public class DataLoadService {

    @Autowired
    CourseDAO courseDAO;

    public List<CourseDTO> convertJsonObjToCourseDTOs(String csvInpString) throws Exception {
        ServiceCSVtoJSON serviceCSVtoJSON = new ServiceCSVtoJSON();
        List<CourseDTO> courses = new ArrayList<CourseDTO>();
        ArrayNode jsonNodes = serviceCSVtoJSON.parse(csvInpString);
        List<CourseDTO> database = courseDAO.findAll();

        Map<String, String> hashtable = new HashMap<>();
        for (CourseDTO course : database) {
            String subjAndNum = course.getSubject() + " " + course.getNumber();
            hashtable.put(subjAndNum, course.getId());
        }
        
        for (JsonNode jsonNode : jsonNodes) {
            List<List<String>> prereq = new ArrayList<>();
            List<List<String>> concur = new ArrayList<>();
            List<String> equiv = new ArrayList<>();
            List<Integer> credit = new ArrayList<>();

            JsonNode prereqs = jsonNode.get("prereq");
            for (JsonNode rowNode : prereqs) {
                List<String> row = new ArrayList<>();
                for (JsonNode cellNode : rowNode) {
                    row.add(cellNode.asText());
                }
                prereq.add(row);
            }

            JsonNode concurs = jsonNode.get("concur");
            for (JsonNode rowNode : concurs) {
                List<String> row = new ArrayList<>();
                for (JsonNode cellNode : rowNode) {
                    row.add(cellNode.asText());
                }
                concur.add(row);
            }
            
            JsonNode equivs = jsonNode.get("equiv");
            for (JsonNode rowNode : equivs) {
                equiv.add(rowNode.asText());
            }
            
            JsonNode credits = jsonNode.get("credit");
            for (JsonNode rowNode : credits) {
                credit.add(rowNode.asInt());
            }

            String subjAndNum = jsonNode.get("subject").asText() + " " + jsonNode.get("number").asText();
            if (hashtable.containsKey(subjAndNum) == false) {
                ObjectId objectId = new ObjectId();
                CourseDTO course = new CourseDTO();
                course.setId(objectId.toString());
                course.setSubject(jsonNode.get("subject").asText());
                course.setNumber(jsonNode.get("number").asText());
                course.setTitle(jsonNode.get("title").asText());
                course.setCredit(credit);
                course.setPrereq(prereq);
                course.setConcur(concur);
                course.setEquiv(equiv);
                courses.add(course);
                hashtable.put(subjAndNum, objectId.toString());
            }
        }

        for (CourseDTO course : courses) {
            
            List<List<String>> prereq = course.getPrereq();
            List<List<String>> newPrereq = new ArrayList<>();
            for (List<String> subList : prereq) {
                List<String> temp = new ArrayList<>();
                for (String s : subList) {
                    String id = hashtable.get(s);
                    temp.add(id);
                }
                newPrereq.add(temp);
            }
            course.setPrereq(newPrereq);

            List<List<String>> concur = course.getConcur();
            List<List<String>> newConcur = new ArrayList<>();
            for (List<String> subList : concur) {
                List<String> temp = new ArrayList<>();
                for (String s : subList) {
                    String id = hashtable.get(s);
                    temp.add(id);
                }
                newConcur.add(temp);
            }
            course.setConcur(newConcur);

            List<String> equiv = course.getEquiv();
            List<String> newEquiv = new ArrayList<>();
            for (String s : equiv) {
                String id = hashtable.get(s);
                newEquiv.add(id);
            }
            course.setEquiv(newEquiv);
        }
        // Calculate Subseqs
        for (CourseDTO course : courses) {
            List<String> subseqCourses= calculateSubseq(courses, hashtable, course);
            course.setSubseq(subseqCourses);
        }
        courseDAO.saveAll(courses);
        return courses;
    }

    public List<String> calculateSubseq(List<CourseDTO> courses, Map<String, String> hashtable, CourseDTO course) {
        List<String> subsequentCourses = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();
        Map<String, Boolean> visited = new HashMap<>();
        for (CourseDTO c : courses) {
            visited.put(c.getId(), false);
        }

        queue.add(hashtable.get(course.getSubject() + " " + course.getNumber()));
        visited.put(course.getId(), true);
        while (!queue.isEmpty()) {
            String currentCourse = queue.remove();
            subsequentCourses.add(currentCourse);
            for (CourseDTO nextcourse : courses) {
                if (nextcourse.getPrereq().stream().anyMatch(list -> list.contains(currentCourse))) {
                    if (visited.get(nextcourse.getId()) == false) {
                        queue.add(nextcourse.getId());
                        visited.put(nextcourse.getId(), true);
                    }
                }
            }
        }
        subsequentCourses.remove(0);

        // Avoiding Duplicate Subseq Course
        Set<String> uniqueSubsequentCourses = new HashSet<>(subsequentCourses);

        // Convert CourseId to Course Subject+Name (For Testing & Sorting purpose)
        List<String> temp = new ArrayList<>();
        for (Entry<String, String> e : hashtable.entrySet()) {
            if (uniqueSubsequentCourses.contains(e.getValue())) {
                temp.add(e.getKey());
            }
        }

        // Sorting in alphbet order
        Collections.sort(temp);

        // Convert back to CourseIds
        subsequentCourses.clear();
        for (String t : temp) {
            subsequentCourses.add(hashtable.get(t));
        }
        return subsequentCourses;
    }
    public String semePatternDetec(List<String> semesters) {
        Set<String> patterns = new HashSet<>();
        for (String semester : semesters) {
            patterns.add(semester.substring(4));
        }
        List<String> list = new ArrayList<String>(patterns);
        if (list.size() == 1 && list.get(0).equals("Spring")) {
            return "Spring Semester Only";
        } else if (list.size() == 1 && list.get(0).equals("Fall")) {
            return "Fall Semester Only";
        }
        return "Both Spring and Fall Semester";
    }

    public void resetDatabase() throws StreamReadException, DatabindException, IOException {
        courseDAO.deleteAll();
    }
}
