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
import java.io.File;
import java.util.ArrayList;
import java.util.Calendar;
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

    // Download datasets via CSVdownloader Service
    public void downloadData() throws Exception {
        ServiceCSVdownloader serviceCSVdownloader = new ServiceCSVdownloader();
        String output = "./backend/data/"; 
        Calendar calendar = Calendar.getInstance();
        // Download is based on current year. EX:  "2023 April" downloads files until "2023-fa", "2023 Nov" downloads file until "2024-sp"
        int currentYear = calendar.get(Calendar.YEAR);
        int currentMonth = calendar.get(Calendar.MONTH) + 1;
        for (int i = 2016; i < currentYear; i++) {
            serviceCSVdownloader.downloadCSV(Integer.toString(i), "sp", output);
            serviceCSVdownloader.downloadCSV(Integer.toString(i), "fa", output);
        }
        serviceCSVdownloader.downloadCSV(Integer.toString(currentYear), "sp", output);
        if (currentMonth >= 11) {
            serviceCSVdownloader.downloadCSV(Integer.toString(currentYear), "fa", output);
            serviceCSVdownloader.downloadCSV(Integer.toString(currentYear + 1), "sp", output);
        } else if (currentMonth >= 4) {
            serviceCSVdownloader.downloadCSV(Integer.toString(currentYear), "fa", output);
        }
    }

    public List<CourseDTO> convertJsonObjToCourseDTOs() throws Exception {
        String folderPath = "./backend/data/";
        File folder = new File(folderPath);
        File[] files = folder.listFiles();

        Map<String, String> hashtable = new HashMap<>();
        List<CourseDTO> courses = new ArrayList<CourseDTO>();

        // Iterate through all datasets
        for (File file : files) {
            if (file.isFile() && file.getName().endsWith(".csv")) {
                ServiceCSVtoJSON serviceCSVtoJSON = new ServiceCSVtoJSON();
                ArrayNode jsonNodes = serviceCSVtoJSON.parse(file.getPath());
                // Converting Json to CourseDTOs
                for (JsonNode jsonNode : jsonNodes) {
                    JsonNode prereqs = jsonNode.get("prereq");
                    JsonNode concurs = jsonNode.get("concur");
                    JsonNode equivs = jsonNode.get("equiv");
                    JsonNode credits = jsonNode.get("credit");
                    List<List<String>> prereq = new ArrayList<>();
                    List<List<String>> concur = new ArrayList<>();
                    List<String> equiv = new ArrayList<>();
                    List<Integer> credit = new ArrayList<>();
                    List<String> semester = new ArrayList<>();
                    for (JsonNode rowNode : prereqs) {
                        List<String> row = new ArrayList<>();
                        for (JsonNode cellNode : rowNode) {
                            row.add(cellNode.asText());
                        }
                        prereq.add(row);
                    }
                    for (JsonNode rowNode : concurs) {
                        List<String> row = new ArrayList<>();
                        for (JsonNode cellNode : rowNode) {
                            row.add(cellNode.asText());
                        }
                        concur.add(row);
                    }
                    for (JsonNode rowNode : equivs) {
                        equiv.add(rowNode.asText());
                    }
                    for (JsonNode rowNode : credits) {
                        credit.add(rowNode.asInt());
                    }
                    semester.add(file.getName().substring(0,7));

                    String subjAndNum = jsonNode.get("subject").asText() + " " + jsonNode.get("number").asText();
                    // If the course already exists in List<CourseDTO>, we merge the information.
                    if (hashtable.containsKey(subjAndNum) == true) {
                        Optional<CourseDTO> findCourse = courseDAO.findById(hashtable.get(subjAndNum));
                        CourseDTO course = findCourse.get();
                        List<List<String>> currPrereq = course.getPrereq();
                        List<List<String>> currConcur = course.getConcur();
                        List<String> currEquiv = course.getEquiv();
                        List<Integer> currCredit = course.getCredit();
                        List<String> currSemester = course.getSemester();
                        for (List<String> subList : prereq) {
                            if (!currPrereq.contains(subList)) {
                                currPrereq.add(subList);
                            }
                        }
                        course.setPrereq(currPrereq);
                        for (List<String> subList : concur) {
                            if (!currConcur.contains(subList)) {
                                currConcur.add(subList);
                            }
                        }
                        course.setConcur(currConcur);
                        for (String elem : equiv) {
                            if (!currEquiv.contains(elem)) {
                                currEquiv.add(elem);
                            }
                        }
                        course.setEquiv(currEquiv);
                        for (Integer elem : credit) {
                            if (!currCredit.contains(elem)) {
                                currCredit.add(elem);
                            }
                        }
                        course.setCredit(currCredit);
                        currSemester.add(file.getName().substring(0,7));
                        course.setSemester(currSemester);
                        // update course
                        courses.removeIf(c ->(c.getId().equals(course.getId())));
                        courses.add(course);
                    // else, we create a new courseDTO object
                    } else {
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
                        course.setSemester(semester);
                        courses.add(course);
                        hashtable.put(subjAndNum, objectId.toString());
                    }
                }
            }
            courseDAO.saveAll(courses);
        }
        // Converting every course's name in prereq/concur/equiv to course ID
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
        // Calculate Subseqs & Detect Pattern
        for (CourseDTO course : courses) {
            List<String> subseqCourses= calculateSubseq(courses, hashtable, course);
            course.setSubseq(subseqCourses);
            String pattern = semPatternDetec(course.getSemester());
            course.setPattern(pattern);
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
    
    public String semPatternDetec(List<String> semesters) {
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);
        int numSp = 0;
        int numFa = 0;
        int totalSem = 0;
        // If the course has not appeared in the last two years
        if (Integer.parseInt(semesters.get(semesters.size() - 1).substring(0, 4)) < currentYear - 2) {
            return "not_recent";
        }
        // Counting the number of times a course appears in the fall/spring & the total number of semesters
        for (String semester : semesters) {
            String[] splitString = semester.split("-");
            String season = splitString[1];
            if (season.equals("fa")) {
                numFa++;
            } else if (season.equals("sp")) {
                numSp++;
            }
            totalSem++;
        }
        // if the number of course appears in fall is greater than 2/3 of the semesters
        if (numFa >= Math.ceil(0.6666667 * totalSem)) {
            return "fa_only";
        // if the number of course appears in spring is greater than 2/3 of the semesters
        } else if (numSp >= Math.ceil(0.6666667 * totalSem)) {
            return "sp_only";
        }
        // otherwise, there is no obvious pattern for this course
        return "none";
    }
    
    public void resetDatabase() throws StreamReadException, DatabindException, IOException {
        courseDAO.deleteAll();
    }
}
