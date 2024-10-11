package com.olivecrm.service;

import com.olivecrm.entity.Employee;
import com.olivecrm.repository.EmployeeRepository;
import com.olivecrm.util.PasswordUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service

public class LoginService {
    @Autowired
    private EmployeeRepository employeeRepository;

    public Employee login(String username, String password) {
        Optional<Employee> employeeOptional = employeeRepository.findByUsername(username);

        if (employeeOptional.isPresent()) {
            Employee employee = employeeOptional.get();
            System.out.println("Employee found: " + employee.getUsername());

            boolean matchPassword = PasswordUtil.checkPassword(password, employee.getPassword());

            if (matchPassword) {
                System.out.println("Password matched for user: " + employee.getUsername());
                return employee;
            } else {
                System.out.println("Password mismatch for user: " + employee.getUsername());
                throw new RuntimeException("Invalid password");
            }
        } else {
            System.out.println("No employee found with username: " + username);
            throw new RuntimeException("Invalid username");
        }
    }
}
