package edu.illinois.cs.iplanner.service;

import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpSession;

@Component
public class UserSessionService {
    public String userId(HttpSession session) {
        return (String)session.getAttribute("user_id");
    }
}
