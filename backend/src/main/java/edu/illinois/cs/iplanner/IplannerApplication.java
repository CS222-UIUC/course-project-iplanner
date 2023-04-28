package edu.illinois.cs.iplanner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableMongoRepositories
@EnableScheduling
public class IplannerApplication {
	@Autowired
	MongoTemplate mongoTemplate;

	public static void main(String[] args) {
		SpringApplication.run(IplannerApplication.class, args);
	}
}
