package edu.illinois.cs.iplanner.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import edu.illinois.cs.iplanner.model.UserDTO;

public interface UserDAO extends MongoRepository<UserDTO, String> {
    List<UserDTO> findAllByUsernameAndPassword(String username, String password);
}