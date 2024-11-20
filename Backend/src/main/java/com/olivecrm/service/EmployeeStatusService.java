package com.olivecrm.service;

import com.olivecrm.entity.Employee;
import com.olivecrm.repository.EmployeeRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class EmployeeStatusService {

    private final EmployeeRepository employeeRepository;

    public EmployeeStatusService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // Scheduled task to run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    public void updateInactiveUsers() {
        // Define the threshold for inactivity (currently 1 month)
        LocalDateTime oneMonthAgo = LocalDateTime.now().minus(1, ChronoUnit.MONTHS);

        // Find all active employees
        List<Employee> employees = employeeRepository.findAll();

        for (Employee employee : employees) {
            // If the employee's last login is older than 1 month, mark as INACTIVE
            if (employee.getStatus() == Employee.Status.ACTIVE &&
                (employee.getLastLogin() == null || employee.getLastLogin().isBefore(oneMonthAgo))) {

                employee.setStatus(Employee.Status.INACTIVE);
                employeeRepository.save(employee);
                System.out.println("Set status to INACTIVE for user: " + employee.getUsername());
            }
        }
    }
}
