package edu.illinois.cs.iplanner.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.bson.types.ObjectId;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.core.exc.StreamReadException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DatabindException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import edu.illinois.cs.iplanner.dao.CourseDAO;
import edu.illinois.cs.iplanner.model.CourseDTO;

@Component
public class DataLoadService {

    @Autowired
    CourseDAO courseDAO;

    public  List<CourseDTO> convertJsonObjToCourseDTOs() throws StreamReadException, DatabindException, IOException {
        List<CourseDTO> courses = new ArrayList<CourseDTO>();
        ObjectMapper objectMapper = new ObjectMapper();
        List<JsonNode> jsonNodes = objectMapper.readValue(new File("C:/Users/Edwardhzh/Desktop/CS 222/course-project-iplanner/backend/data/2023-sp.json"), new TypeReference<List<JsonNode>>() {});
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
        courseDAO.saveAll(courses);
        return courses;
    }

    public void resetDatabase() throws StreamReadException, DatabindException, IOException {
        courseDAO.deleteAll();
    }
}
