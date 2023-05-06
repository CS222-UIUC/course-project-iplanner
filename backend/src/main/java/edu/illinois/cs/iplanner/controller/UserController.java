package edu.illinois.cs.iplanner.controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.illinois.cs.iplanner.dao.SaveDAO;
import edu.illinois.cs.iplanner.dao.UserDAO;
import edu.illinois.cs.iplanner.model.SaveDTO;
import edu.illinois.cs.iplanner.model.UserDTO;
import edu.illinois.cs.iplanner.service.UserSessionService;
import edu.illinois.cs.iplanner.vo.LoginVO;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    UserDAO userDAO;

    @Autowired
    SaveDAO saveDAO;

    @Autowired
    UserSessionService userSessionService;

    @PostMapping("/login")
    public void login(@RequestBody LoginVO loginVO, HttpSession session, HttpServletResponse response) throws IOException {
        List<UserDTO> users = userDAO.findAllByUsernameAndPassword(loginVO.getUsername(), loginVO.getPassword());
        if (users.isEmpty()) { // Auth failed
            response.setStatus(401);
            response.getWriter().append("401");
            return;
        }

        session.setAttribute("user_id", users.get(0).getId());
    }

    @GetMapping("/debug/create")
    public void create(@RequestParam(name = "username") String username, @RequestParam(name = "password") String password) {
        UserDTO user = new UserDTO();
        user.setUsername(username);
        user.setPassword(password);
        userDAO.save(user);
    }

    @GetMapping("/plan")
    public List<List<String>> getUserPlan(HttpSession session, HttpServletResponse response) throws IOException {
        String userId = userSessionService.userId(session);
        SaveDTO save = saveDAO.findByUser(userId);
        if (save == null) {
            return null;
        }
        return save.getPlan();
    }

    @PostMapping("/save")
    public void saveUserPlan(HttpSession session, @RequestBody List<List<String>> plan){
        String userId = userSessionService.userId(session);
        SaveDTO save = saveDAO.findByUser(userId);
        if (save != null) {
            save.setPlan(plan);
        } else {
            save = new SaveDTO();
            save.setUser(userId);
            save.setPlan(plan);
        }
        saveDAO.save(save);
    }
}
