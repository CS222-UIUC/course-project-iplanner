package service;

import java.io.*;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.dataformat.csv.*;

public class Service_csv_to_json {
    public static void main(String[] args) throws Exception {

        ObjectMapper objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
        CsvMapper csvMapper = new CsvMapper();

        CsvSchema csvSchema = CsvSchema.emptySchema().withHeader();
        List<Object> csvData = csvMapper.readerFor(Map.class).with(csvSchema).readValues(new File("./backend/data/2023-sp-tiny.csv")).readAll();
        
        System.out.println("=======================================\n");
        JsonNodeFactory jsonFactory = JsonNodeFactory.instance;

        Map<String, ObjectNode> itemNodes = new HashMap<>();

        for (Object object_row : csvData) {
            Map<String, String> row = (Map<String, String>) object_row;
            String subject = row.get("Subject");
            String number = row.get("Number");
            String title = row.get("Name");
            // Integer credit = Integer.valueOf(row.get("Credit Hours"));
            String credit = row.get("Credit Hours");
            String section_info = row.get("Section Info");
            
            ObjectNode itemNode = jsonFactory.objectNode();
            itemNode.put("subject", subject);
            itemNode.put("number", number);
            itemNode.put("title", title);
            itemNode.put("credit", credit);

            itemNode.put("info", section_info);
            
            String key = subject + number;
            itemNodes.put(key, itemNode);
        }

        ArrayNode rootArray = jsonFactory.arrayNode();
        for (ObjectNode itemNode : itemNodes.values()) {
            rootArray.add(itemNode);
        }
        objectMapper.writeValue(new File("./backend/data/service_test.json"), rootArray);
    }
}