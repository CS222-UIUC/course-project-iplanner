package edu.illinois.cs.iplanner.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("courses")
public class CourseDTO {
    @Id
    private String id;
    
    private String subject;

    private String number;

    private String title;

    private List<Integer> credit;

    private List<List<String>> prereq;

    private List<List<String>> concur;
    
    private List<String> subseq;

    private List<String> equiv;

    private List<String> semester;

    private String pattern;

    private String description;
}
