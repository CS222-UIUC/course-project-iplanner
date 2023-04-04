package edu.illinois.cs.iplanner.service;

import java.io.*;
import java.util.*;

import org.springframework.lang.Nullable;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.csv.*;

public class ServiceCSVtoJSON {
    /**
     * 
     * @param csvInpString  source file path
     * @return an ArrayNode containing all needed info about courses
     * @throws Exception
     */
    public ArrayNode parse(String csvInpString) throws Exception {
        return parse(csvInpString, null);
    }
    /**
     * 
     * @param csvInputPath  source file path
     * @param jsonOuputPath output file path, Nullable
     * @return an ArrayNode containing all needed info about courses
     * @throws Exception
     */
    public ArrayNode parse(String csvInputPath, @Nullable String jsonOuputPath) throws Exception {
        //Lists to store related info
        List<Integer> credits = new ArrayList<>();
        List<String> sameAS = new ArrayList<>();
        List<String> equivalent = new ArrayList<>();
        List<List<String>> prerequisite = new ArrayList<>();
        List<List<String>> concurrent = new ArrayList<>();
        String lastCourse = "-";                     //this String should be removed when sections of a course are included

        int count = 0;
        int identicalCount = 0;
        //CSV and JSON setup
        ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        CsvMapper csvMapper = new CsvMapper();
        CsvSchema csvSchema = CsvSchema.emptySchema().withHeader();
        List<Object> csvData = csvMapper.readerFor(Map.class).with(csvSchema).readValues(new File(csvInputPath)).readAll();
        JsonNodeFactory jsonFactory = JsonNodeFactory.instance;
        Map<String, ObjectNode> itemNodes = new HashMap<>();
        //read from CSV line by line
        for (Object object_row : csvData) {
            count++;
            Map<String, String> row = (Map<String, String>) object_row;
            String subject = row.get("Subject");
            String number = row.get("Number");
            //this block should be removed when sections of a course are included
            if (lastCourse.equals(subject + number)) {
                continue;
            }
            identicalCount++;
            lastCourse = subject + number;

            //empty info lists for each iteration
            credits.clear();
            sameAS.clear();
            equivalent.clear();
            prerequisite.clear();
            concurrent.clear();
            //update info lists
            updateINFO(row.get("Section Info").split("\\."), sameAS, equivalent, prerequisite, concurrent);
            //update course credits
            // System.out.println(row.get("Credit Hours"));
            updateCredits(row.get("Credit Hours").split(" "), credits);
            //Create and update a node to store all info needed for json
            ObjectNode itemNode = jsonFactory.objectNode();
            itemNode.put("subject", subject);
            itemNode.put("number", number);
            itemNode.put("title", row.get("Name"));
            // itemNode.put("credit", row.get("Credit Hours"));
            ArrayNode credit = objectMapper.createArrayNode();
            ArrayNode same = objectMapper.createArrayNode();
            ArrayNode prereq = objectMapper.createArrayNode();
            ArrayNode concur = objectMapper.createArrayNode();
            ArrayNode equiv = objectMapper.createArrayNode();
            for (Integer c : credits) {
                credit.add(c);
            }
            for (String course : sameAS) {
                same.add(course);
            }
            for (String course : equivalent) {
                equiv.add(course);
            }
            for (List<String> concurrs : concurrent) {
                ArrayNode subNode = concur.addArray();
                for (String concurr : concurrs) {
                    subNode.add(concurr);
                }
            }
            for (List<String> preps : prerequisite) {
                ArrayNode subNode = prereq.addArray();
                for (String prep : preps) {
                    subNode.add(prep);
                }
            }
            itemNode.set("credit", credit);
            itemNode.set("same", same);
            itemNode.set("equiv", equiv);
            itemNode.set("concur", concur);
            itemNode.set("prereq", prereq);
            String key = subject + number;
            itemNodes.put(key, itemNode);
        }
        //Convert to JSON
        ArrayNode rootArray = jsonFactory.arrayNode();
        for (ObjectNode itemNode : itemNodes.values()) {
            rootArray.add(itemNode);
        }
        
        //Test info
        // System.out.println("conversation completed:\t" + count + " tasks has completed, with " + identicalCount + " identical courses");
        if (jsonOuputPath != null) {
            objectMapper.writeValue(new File(jsonOuputPath), rootArray);
            System.out.println("The output file can be found at:\n\t" + jsonOuputPath);
        }

        return rootArray;
    }

    //update prereq, concur, etc to static lists 
    private void updateINFO(String[] infos, List<String> sameAS, List<String> equivalent, List<List<String>> prerequisite, List<List<String>> concurrent) {
        for (String info : infos) {
            info = info.trim();
            try {
                if (info.startsWith("Prerequisite:")) {
                    updatePRECON(info.split(" "), prerequisite, concurrent);
                    continue;
                }
                if (info.startsWith("Same as")) {
                    updateSAMEAS(info.split(" "), sameAS);
                    continue;
                }
                if (info.startsWith("Credit is not given")) {
                    updateEQV(info.split(" "), equivalent);
                    continue;
                }
            } catch (Exception e) {
                continue;
            }
        }
    }
    //helper funtion to generate course prerequisites and concurrents
    private void updatePRECON(String[] words, List<List<String>> prerequisite, List<List<String>> concurrent) {
        List<String> courses = new ArrayList<>();
        int which_list = 1;    //1 when to prereq
        boolean push = false;   //true when should push to list
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (word.equals("concurrent")) {
                which_list = 0;
                continue;
            }
            //handle special case:
            //requiring multiple concurrent courses, such as CEE 537
            if (which_list == 0 && word.equals("and")) {
                concurrent.add(new ArrayList<>());
                concurrent.get(concurrent.size() - 1).addAll(courses);
                courses.clear();
                continue;
            }
            if (word.endsWith(";")) {                             //erase course number when it is the last element of the array
                push = true;
                word = word.substring(0, word.length() - 1);
            }
            if (word.endsWith(",")) {
                word = word.substring(0, word.length() - 1);
            }
            try {
                Integer.parseInt(word);
                String course = words[i - 1] + " " + word;
                courses.add(course);
            } catch (Exception e) {}

            if (push) {
                if (which_list == 1) {
                    prerequisite.add(new ArrayList<>());
                    prerequisite.get(prerequisite.size() - 1).addAll(courses);
                } else {
                    concurrent.add(new ArrayList<>());
                    concurrent.get(concurrent.size() - 1).addAll(courses);
                    which_list = 1;
                }
                push = false;
                courses.clear();
            }
        }
        if (!courses.isEmpty()) {
            if (which_list == 1) {
                prerequisite.add(new ArrayList<>());
                prerequisite.get(prerequisite.size() - 1).addAll(courses);
            } else {
                // concurrent.addAll(courses);
                concurrent.add(new ArrayList<>());
                concurrent.get(concurrent.size() - 1).addAll(courses);
            }
        }
    }
    //helper funtion to generate courses that are the same
    private void updateSAMEAS(String[] words, List<String> sameAS) {
        for (int i = 1; i < words.length; i++) {
            try {
                Integer.parseInt(words[i]);
                String course = words[i - 1] + " " + words[i];
                sameAS.add(course);
            } catch (Exception e) {
                continue;
            }
        }
    }
    //helper funtion to generate equivalent courses
    private void updateEQV(String[] words, List<String> equivalent) {
        for (int i = 1; i < words.length; i++) {
            try {
                Integer.parseInt(words[i]);
                String course = words[i - 1] + " " + words[i];
                equivalent.add(course);
            } catch (Exception e) {
                continue;
            }
        }
    }
    //helper funtion to parse course credits
    private void updateCredits(String[] arr, List<Integer> credits) {
        try {
            if (arr.length == 0) return;
            if (arr.length == 2) {
                credits.add(Integer.parseInt(arr[0]));
                return;
            }
            Integer left = Integer.parseInt(arr[0]);
            Integer right = Integer.parseInt(arr[2]);
            if (arr[1].toUpperCase().equals("OR")) {
                credits.add(left);
                credits.add(right);
            } else {
                for (; left <= right; left++) {
                    credits.add(left);
                }
            }
        } catch (Exception e) {
            return;
        }
    }
}