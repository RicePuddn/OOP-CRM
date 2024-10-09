package com.olivecrm.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.User;
import com.olivecrm.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User createUser(String email, String rawPassword, String role) throws Exception {
        // Check if user already exists
        if (userRepository.findByEmail(email) != null) {
            throw new Exception("User with this email already exists.");
        }

        // Create new user
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));  // Encrypt password
        user.setRole(role);
        
        return userRepository.save(user);  // Save the new user to the database
    }
}