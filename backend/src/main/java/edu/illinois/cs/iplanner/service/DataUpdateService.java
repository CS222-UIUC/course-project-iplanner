package edu.illinois.cs.iplanner.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


@Service
public class DataUpdateService {

    @Autowired
    DataLoadService dataLoadService;

    @Scheduled(cron = "0 0 0 * * *") // Runs Once every 12AM
    public void checkDatabaseIsUpToDate() throws Exception {
        dataLoadService.downloadData();
        dataLoadService.convertJsonObjToCourseDTOs();
    }
}
