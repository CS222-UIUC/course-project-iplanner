package edu.illinois.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;

import edu.illinois.cs.iplanner.service.ServiceCSVtoJSON;

public class ServiceTest {
    public static void main(String[] args) throws Exception {
        System.out.println("===== Tester Starts =====");
        String csvInputPath = "./backend/src/test/java/edu/illinois/data/csv-json-input.csv";
        String jsonOuputPath = "./backend/src/test/java/edu/illinois/data/csv-json-output.json";
        ServiceCSVtoJSON converter = new ServiceCSVtoJSON();
        ArrayNode nodes = converter.parse(csvInputPath);
        // ArrayNode nodes = converter.parse(csvInputPath, jsonOuputPath);
        //This is a very tiny test
        if (nodes.size() != 1) {
            throw new AssertionError("\nERROR: Size doesn't match. Expected: 1 course\tBut has: " + nodes.size());
        }
        JsonNode node = nodes.get(0);
        if (node.get("subject").asText().equals("CS") == false) {
            throw new AssertionError("\nERROR: Subject doesn't match. Expected: CS\tBut has: " + node.get("subject").asText());
        }
        if (node.get("number").asText().equals("233") == false) {
            throw new AssertionError("\nERROR: Course number doesn't match. Expected: 233\tBut has: " + node.get("number").asText());
        }
        if (node.get("credit").isArray() == false) {
            throw new AssertionError("\nERROR: Expect field <credit> been stored as an array");
        }
        JsonNode credits = node.get("credit");
        if (credits.size() != 1) {
            throw new AssertionError("\nERROR: Credit array size doesn't match. Expected: 1 \tBut has: " + credits.size());
        }
        if (credits.get(0).asInt() != 4) {
            throw new AssertionError("\nERROR: Credit Hour doesn't match. Expected: 4 hours\tBut has: " + credits.get(0).asInt());
        }
        
        System.out.println("===== All Tests Passed =====");
    }
}
