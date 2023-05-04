package edu.illinois.cs.iplanner.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import edu.illinois.cs.iplanner.model.SaveDTO;

public interface SaveDAO extends MongoRepository<SaveDTO, String> {
    SaveDTO findByUser(String user);
}