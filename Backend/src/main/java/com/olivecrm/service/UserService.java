package com.olivecrm.service;

import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.olivecrm.entity.User;
import com.olivecrm.entity.User.Role;
import com.olivecrm.repository.UserRepository;
import com.olivecrm.util.PasswordUtil;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // CREATE USER
    public User createUser(String username, String firstName, String lastName, String rawPassword, Role role) throws Exception {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            throw new Exception("Username already exists!");
        }
        // Create new user
        User user = new User();
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPassword(PasswordUtil.hashPassword(rawPassword));  // Encrypt password
        user.setRole(role);
        
        return userRepository.save(user);  // Save the new user to the database
    }

    // UPDATE USER
    public User updateUser(String username, String firstName, String lastName, String password, Role role) throws Exception {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            
            // Only update fields that are provided
            if (username != null && !username.isEmpty()) {
                user.setUsername(username);
            }
            if (firstName != null && !firstName.isEmpty()) {
                user.setFirstName(firstName);
            }
            if (lastName != null && !lastName.isEmpty()) {
                user.setLastName(lastName);
            }
            if (password != null && !password.isEmpty()) {
                user.setPassword(PasswordUtil.hashPassword(password)); // Only update password if provided
            }
            if (role != null) {
                user.setRole(role);
            }

            return userRepository.save(user); // Save the updated user
        } else {
            throw new Exception("User not found");
        }
    }

    // DELETE USER
    @Transactional
    public void deleteUser(String username) throws Exception {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isPresent()) {
            userRepository.deleteByUsername(username); // Delete the user
        } else {
            throw new Exception("User not found");
        }
    }
}