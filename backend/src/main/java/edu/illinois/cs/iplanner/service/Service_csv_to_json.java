package edu.illinois.cs.iplanner.service;

import java.io.*;
import java.util.*;

import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.csv.*;

public class Service_csv_to_json {
    private static String csvInputPath = "./backend/data/2023-sp.csv";
    private static String jsonOuputPath = "./backend/data/2023-sp.json";
    private static List<String> sameAS = new ArrayList<>();
    private static List<String> equivalent = new ArrayList<>();
    private static List<List<String>> prerequisite = new ArrayList<>();
    private static List<String> concurrent = new ArrayList<>();
    private static String lastCourse = "-";                     //this String should be removed when sections of a course are included

    public static void main(String[] args) throws Exception {
        int count = 0;
        int identicalCount = 0;

        ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        CsvMapper csvMapper = new CsvMapper();

        CsvSchema csvSchema = CsvSchema.emptySchema().withHeader();
        List<Object> csvData = csvMapper.readerFor(Map.class).with(csvSchema).readValues(new File(csvInputPath)).readAll();
        
        JsonNodeFactory jsonFactory = JsonNodeFactory.instance;

        Map<String, ObjectNode> itemNodes = new HashMap<>();
        
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

            String title = row.get("Name");
            String credit = row.get("Credit Hours");
            
            sameAS.clear();
            equivalent.clear();
            prerequisite.clear();
            concurrent.clear();

            updateINFO(row.get("Section Info").split("\\."));

            ObjectNode itemNode = jsonFactory.objectNode();
            itemNode.put("subject", subject);
            itemNode.put("number", number);
            itemNode.put("title", title);
            itemNode.put("credit", credit);

            ArrayNode same = objectMapper.createArrayNode();
            ArrayNode prereq = objectMapper.createArrayNode();
            ArrayNode concur = objectMapper.createArrayNode();
            ArrayNode equiv = objectMapper.createArrayNode();
            
            for (String course : sameAS) {
                same.add(course);
            }
            for (String course : equivalent) {
                equiv.add(course);
            }
            for (String course : concurrent) {
                concur.add(course);
            }
            for (List<String> preps : prerequisite) {
                ArrayNode subNode = prereq.addArray();
                for (String prep : preps) {
                    subNode.add(prep);
                }
            }
            
            itemNode.set("same", same);
            itemNode.set("equiv", equiv);
            itemNode.set("concur", concur);
            itemNode.set("prereq", prereq);
            

            String key = subject + number;
            itemNodes.put(key, itemNode);
        }

        ArrayNode rootArray = jsonFactory.arrayNode();
        for (ObjectNode itemNode : itemNodes.values()) {
            rootArray.add(itemNode);
        }
        objectMapper.writeValue(new File(jsonOuputPath), rootArray);
        System.out.println("conversation finished:\t" + count + " tasks has completed, with " + identicalCount + " identical courses");
        System.out.println("The output file can be found at:\n\t" + jsonOuputPath);
    }

    //update prereq, concur, etc to static lists 
    private static void updateINFO(String[] infos) {
        for (String info : infos) {
            info = info.trim();
            try {
                if (info.startsWith("Prerequisite:")) {
                    updatePRECON(info.split(" "));
                    continue;
                }
                if (info.startsWith("Same as")) {
                    updateSAMEAS(info.split(" "));
                    continue;
                }
                if (info.startsWith("Credit is not given")) {
                    updateEQV(info.split(" "));
                    continue;
                }
            } catch (Exception e) {
                continue;
            }
        }
    }

    private static void updatePRECON(String[] words) {
        List<String> courses = new ArrayList<>();
        int which_list = 1;    //1 when to prereq
        boolean push = false;   //true when should push to list
        for (int i = 0; i < words.length; i++) {
            String word = words[i];
            if (word.equals("concurrent")) {
                which_list = 0;
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
                    concurrent.addAll(courses);
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
                concurrent.addAll(courses);
            }
        }
    }

    private static void updateSAMEAS(String[] words) {
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

    private static void updateEQV(String[] words) {
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

}