package edu.illinois.cs.iplanner.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("saves")
public class SaveDTO {
    @Id
    private String id;

    private String user;

    private List<List<String>> plan;
}
