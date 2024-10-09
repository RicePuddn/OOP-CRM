package com.olivecrm.service;

import java.util.Optional;

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

    // CREATE USER
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

    // UPDATE USER
    public User updateUser(Long userId, String email, String password, String role) throws Exception {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Only update fields that are provided
            if (email != null && !email.isEmpty()) {
                user.setEmail(email);
            }
            if (password != null && !password.isEmpty()) {
                user.setPassword(passwordEncoder.encode(password)); // Only update password if provided
            }
            if (role != null && !role.isEmpty()) {
                user.setRole(role);
            }

            return userRepository.save(user); // Save the updated user
        } else {
            throw new Exception("User not found");
        }
    }

    // DELETE USER
    public void deleteUser(Long userId) throws Exception {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get()); // Delete the user
        } else {
            throw new Exception("User not found");
        }
    }
}