package edu.illinois.cs.iplanner.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.illinois.cs.iplanner.dao.SaveDAO;
import edu.illinois.cs.iplanner.model.SaveDTO;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    SaveDAO saveDAO;

    @GetMapping("/plan")
    public List<List<String>> getUserPlan(@PathVariable(name = "userId") String userId) {
        SaveDTO save = saveDAO.findByUserId(userId);
        if (save == null) {
            return new ArrayList<>();
        }
        return save.getPlan();
    }

    @PostMapping("/save")
    public void saveUserPlan(@PathVariable(name = "userId") String userId, @PathVariable(name = "plan") List<List<String>> plan){
        SaveDTO save = saveDAO.findByUserId(userId);
        if (save != null) {
            save.setPlan(plan);
        }
    }
}
