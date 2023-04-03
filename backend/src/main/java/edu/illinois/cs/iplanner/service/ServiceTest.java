package edu.illinois.cs.iplanner.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class ServiceTest {
    public static void main(String[] args) throws Exception {
        String csvInputPath = "./backend/data/2023-sp.csv";
        // String jsonOuputPath = "./backend/data/2023-sp.json";
        ServiceCSVtoJSON converter = new ServiceCSVtoJSON();
        ArrayNode nodes = converter.parse(csvInputPath, null);
        for (JsonNode node : nodes) {
            // if (!node.get("subject").asText().equals("CS")) {
            //     continue;
            // }
            // if (!node.get("number").asText().equals("233")) {
            //     continue;
            // }
            // assert node.get("title").asText().equals("Computer Architecture") : "CS 233 has a wrong title";
        }
        System.out.println("===== Test Completed =====");
    }
}
