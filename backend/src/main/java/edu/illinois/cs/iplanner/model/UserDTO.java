package edu.illinois.cs.iplanner.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("users")
public class UserDTO {
    @Id
    private String id;

    private String username;

    private String password;
}
